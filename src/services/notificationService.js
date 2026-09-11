/**
 * Bildirim Yönetim Servisi
 * iPhone (iOS Safari / PWA) ve masaüstü tarayıcı uyumlu bildirim kontrolü.
 */

import { differenceInCalendarDays, parseISO } from 'date-fns';

export const notificationService = {
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },

  isStandalone() {
    return Boolean(window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches);
  },

  /**
   * Tarayıcı bildirim durumunu döner
   */
  getPermissionStatus() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission; // 'default', 'granted', 'denied'
  },

  /**
   * Bildirim izni talep eder (iPhone ve HTTPS uyumlu)
   */
  async requestPermission() {
    const isIOS = this.isIOS();
    const isStandalone = this.isStandalone();

    // 1. iPhone Safari Sekmesi Kontrolü
    if (isIOS && !isStandalone) {
      return {
        status: 'ios_safari_tab',
        reason: "iPhone kuralı: Bildirim izni için önce Safari'den 'Ana Ekrana Ekle' yapıp, ana ekrandaki simgeden açmalısınız.",
      };
    }

    // 2. Destek kontrolü
    if (!('Notification' in window)) {
      return {
        status: 'unsupported',
        reason: 'Cihazınız veya tarayıcınız Web Bildirimlerini desteklemiyor.',
      };
    }

    // 3. HTTPS / Güvenli Bağlantı kontrolü
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!window.isSecureContext && !isLocalhost) {
      return {
        status: 'insecure',
        reason: 'Bildirimler için HTTPS bağlantısı gereklidir.',
      };
    }

    // 4. İzin İsteme
    try {
      let permission;
      if (typeof Notification.requestPermission === 'function') {
        try {
          permission = await Notification.requestPermission();
        } catch {
          permission = await new Promise((resolve) => {
            Notification.requestPermission(resolve);
          });
        }
      }

      if (permission === 'granted') {
        return { status: 'granted' };
      } else {
        return {
          status: 'denied',
          reason: 'Bildirim izni verilmedi veya cihaz ayarlarından engellendi.',
        };
      }
    } catch (error) {
      console.error('Bildirim izni hatası:', error);
      return { status: 'denied', reason: error.message };
    }
  },

  /**
   * Test bildirimi gönderir
   */
  async sendTestNotification() {
    if (this.getPermissionStatus() !== 'granted') {
      return false;
    }

    try {
      new Notification('🔔 Abonnes Bildirimi Aktif!', {
        body: 'Abonelik ve deneme süresi hatırlatıcılarınız zamanında iletilecektir.',
        icon: '/abonnes-logo.svg',
      });
      return true;
    } catch (e) {
      console.error('Test bildirimi gönderilemedi:', e);
      return false;
    }
  },

  /**
   * Yaklaşan deneme ve ödeme alarmlarını hesaplar
   */
  checkDueAlerts(subscriptions) {
    const today = new Date();
    const alerts = [];

    subscriptions.forEach((sub) => {
      if (sub.status === 'cancelled') return;
      if (!sub.notifications_enabled) return;

      // 1. Ücretsiz Deneme Bitişi
      if (sub.is_trial && sub.trial_end_date) {
        try {
          const endDate = parseISO(sub.trial_end_date);
          const daysLeft = differenceInCalendarDays(endDate, today);

          if (daysLeft < 0) {
            alerts.push({
              id: `trial_expired_${sub.subscription_id}`,
              subscription: sub,
              type: 'trial_expired',
              severity: 'critical',
              title: `⚠️ Deneme Doldu: ${sub.custom_name}`,
              message: 'Otomatik para çekilmemesi için hemen iptal edin.',
              daysLeft,
            });
          } else if (daysLeft <= 3) {
            alerts.push({
              id: `trial_ending_${sub.subscription_id}`,
              subscription: sub,
              type: 'trial_ending',
              severity: daysLeft <= 1 ? 'critical' : 'warning',
              title: `⏳ Deneme Bitiyor: ${sub.custom_name}`,
              message: daysLeft === 0
                ? 'Bugün deneme sürenizin son günü!'
                : `Denemenizin bitmesine son ${daysLeft} gün kaldı!`,
              daysLeft,
            });
          }
        } catch (error) {
          console.warn(`Geçersiz deneme bitiş tarihi: ${sub.subscription_id}`, error);
        }
      }

      // 2. Yaklaşan Fatura
      if (sub.next_billing_date) {
        try {
          const billingDate = parseISO(sub.next_billing_date);
          const daysLeft = differenceInCalendarDays(billingDate, today);
          const reminderDays = sub.reminder_days_before || [3, 1];

          if (reminderDays.includes(daysLeft) || daysLeft === 0) {
            alerts.push({
              id: `billing_due_${sub.subscription_id}_${daysLeft}`,
              subscription: sub,
              type: 'billing_due',
              severity: daysLeft <= 1 ? 'warning' : 'info',
              title: `💳 Ödeme Yaklaşıyor: ${sub.custom_name}`,
              message: daysLeft === 0
                ? `Bugün ${sub.price} ${sub.currency} ödemeniz var.`
                : `${daysLeft} gün sonra ${sub.price} ${sub.currency} çekilecek.`,
              daysLeft,
            });
          }
        } catch (error) {
          console.warn(`Geçersiz ödeme tarihi: ${sub.subscription_id}`, error);
        }
      }
    });

    return alerts;
  },
};
