/**
 * Yerel Depolama (LocalStorage) ve Veri Yönetim Servisi
 * PRD şemasına tam uyumlu CRUD, import/export ve ilk tohum verileri sağlar.
 */

const STORAGE_KEY = 'subtrack_subscriptions_v1';
const BILLING_CYCLES = new Set(['weekly', 'monthly', 'yearly']);

function isDateString(value) {
  return !value || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime()));
}

function normalizeSubscription(subscription, index = 0) {
  if (!subscription || typeof subscription !== 'object') return null;

  const customName = typeof subscription.custom_name === 'string' ? subscription.custom_name.trim() : '';
  const price = Number(subscription.price);
  const billingCycle = BILLING_CYCLES.has(subscription.billing_cycle) ? subscription.billing_cycle : 'monthly';

  if (!customName || !Number.isFinite(price) || price < 0) return null;
  if (!isDateString(subscription.start_date) || !isDateString(subscription.next_billing_date)) return null;
  if (subscription.trial_end_date && !isDateString(subscription.trial_end_date)) return null;

  return {
    ...subscription,
    subscription_id: typeof subscription.subscription_id === 'string' && subscription.subscription_id
      ? subscription.subscription_id
      : `sub_imported_${Date.now()}_${index}`,
    user_id: subscription.user_id || 'user_local',
    custom_name: customName,
    price,
    currency: typeof subscription.currency === 'string' ? subscription.currency.toUpperCase() : 'TRY',
    billing_cycle: billingCycle,
    is_trial: Boolean(subscription.is_trial),
    status: subscription.status === 'cancelled' ? 'cancelled' : 'active',
    notifications_enabled: subscription.notifications_enabled !== false,
    reminder_days_before: Array.isArray(subscription.reminder_days_before)
      ? subscription.reminder_days_before.filter((day) => Number.isInteger(day) && day >= 0)
      : [3, 1],
  };
}

function normalizeSubscriptionList(list) {
  const normalized = list.map(normalizeSubscription).filter(Boolean);
  if (normalized.length !== list.length) {
    throw new Error('Bir veya daha fazla abonelik kaydı geçersiz. İçe aktarma iptal edildi.');
  }
  return normalized;
}

// Uygulama ilk açıldığında gösterilecek zengin örnek veri seti
const INITIAL_DEMO_SUBSCRIPTIONS = [
  {
    subscription_id: 'sub_demo_1',
    user_id: 'user_local',
    service_id: 'cursor-ai',
    custom_name: 'Cursor AI Pro (Deneme)',
    category: 'AI',
    price: 20.0,
    currency: 'USD',
    billing_cycle: 'monthly',
    start_date: '2026-08-25',
    next_billing_date: '2026-09-10',
    is_trial: true,
    trial_end_date: '2026-09-10', // 2 gün sonra bitiyor (Kritik Alarm!)
    cancel_url: 'https://www.cursor.com/settings',
    payment_method_note: 'Enpara Sanal Kart',
    notifications_enabled: true,
    reminder_days_before: [3, 1],
    createdAt: new Date().toISOString(),
  },
  {
    subscription_id: 'sub_demo_2',
    user_id: 'user_local',
    service_id: 'netflix-tr',
    custom_name: 'Netflix Standart (1080p)',
    category: 'Streaming',
    price: 229.99,
    currency: 'TRY',
    billing_cycle: 'monthly',
    start_date: '2026-08-15',
    next_billing_date: '2026-09-15',
    is_trial: false,
    trial_end_date: null,
    cancel_url: 'https://www.netflix.com/youraccount',
    payment_method_note: 'Garanti Bonus Kart',
    notifications_enabled: true,
    reminder_days_before: [3, 1],
    createdAt: new Date().toISOString(),
  },
  {
    subscription_id: 'sub_demo_3',
    user_id: 'user_local',
    service_id: 'chatgpt-plus',
    custom_name: 'ChatGPT Plus',
    category: 'AI',
    price: 20.0,
    currency: 'USD',
    billing_cycle: 'monthly',
    start_date: '2026-08-28',
    next_billing_date: '2026-09-28',
    is_trial: false,
    trial_end_date: null,
    cancel_url: 'https://chatgpt.com/#settings/Subscription',
    payment_method_note: 'İş Bankası Maximum',
    notifications_enabled: true,
    reminder_days_before: [3],
    createdAt: new Date().toISOString(),
  },
  {
    subscription_id: 'sub_demo_4',
    user_id: 'user_local',
    service_id: 'spotify-tr',
    custom_name: 'Spotify Bireysel',
    category: 'Music',
    price: 59.99,
    currency: 'TRY',
    billing_cycle: 'monthly',
    start_date: '2026-09-01',
    next_billing_date: '2026-10-01',
    is_trial: false,
    trial_end_date: null,
    cancel_url: 'https://www.spotify.com/account/overview/',
    payment_method_note: 'Papara Sanal Kart',
    notifications_enabled: true,
    reminder_days_before: [2],
    createdAt: new Date().toISOString(),
  },
  {
    subscription_id: 'sub_demo_5',
    user_id: 'user_local',
    service_id: 'amazon-prime-tr',
    custom_name: 'Amazon Prime TR (Ücretsiz Deneme)',
    category: 'Streaming',
    price: 39.0,
    currency: 'TRY',
    billing_cycle: 'monthly',
    start_date: '2026-09-01',
    next_billing_date: '2026-10-01',
    is_trial: true,
    trial_end_date: '2026-10-01',
    cancel_url: 'https://www.amazon.com.tr/mc/manage',
    payment_method_note: 'QNB Finansbank',
    notifications_enabled: true,
    reminder_days_before: [3, 1],
    createdAt: new Date().toISOString(),
  },
];

export const storageService = {
  /**
   * Tüm abonelikleri getirir (kayıt yoksa demo verileriyle başlatır)
   */
  getSubscriptions() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveAllSubscriptions(INITIAL_DEMO_SUBSCRIPTIONS);
        return INITIAL_DEMO_SUBSCRIPTIONS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) throw new Error('Abonelik verisi dizi biçiminde değil.');
      const normalized = parsed.map(normalizeSubscription).filter(Boolean);
      if (normalized.length !== parsed.length) throw new Error('Geçersiz abonelik kaydı.');
      return normalized;
    } catch (e) {
      console.error('LocalStorage okuma hatası:', e);
      return INITIAL_DEMO_SUBSCRIPTIONS;
    }
  },

  /**
   * Tüm abonelik dizisini kaydeder
   */
  saveAllSubscriptions(subs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
    } catch (e) {
      console.error('LocalStorage yazma hatası:', e);
    }
  },

  /**
   * Yeni abonelik ekler
   */
  addSubscription(sub) {
    const subs = this.getSubscriptions();
    const newSub = {
      ...sub,
      subscription_id: sub.subscription_id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: sub.user_id || 'user_local',
      createdAt: new Date().toISOString(),
    };
    const normalized = normalizeSubscription(newSub);
    if (!normalized) return null;
    subs.unshift(normalized);
    this.saveAllSubscriptions(subs);
    return normalized;
  },

  /**
   * Var olan aboneliği günceller
   */
  updateSubscription(updatedSub) {
    const subs = this.getSubscriptions();
    const index = subs.findIndex(s => s.subscription_id === updatedSub.subscription_id);
    if (index !== -1) {
      const candidate = normalizeSubscription({ ...subs[index], ...updatedSub, updatedAt: new Date().toISOString() });
      if (!candidate) return null;
      subs[index] = candidate;
      this.saveAllSubscriptions(subs);
      return candidate;
    }
    return null;
  },

  /**
   * Abonelik siler
   */
  deleteSubscription(id) {
    const subs = this.getSubscriptions();
    const filtered = subs.filter(s => s.subscription_id !== id);
    this.saveAllSubscriptions(filtered);
    return filtered;
  },

  cancelSubscription(id) {
    const subs = this.getSubscriptions();
    const index = subs.findIndex((subscription) => subscription.subscription_id === id);
    if (index === -1) return null;

    subs[index] = {
      ...subs[index],
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      notifications_enabled: false,
    };
    this.saveAllSubscriptions(subs);
    return subs[index];
  },

  /**
   * Verileri JSON dosyası olarak dışa aktarır
   */
  exportData() {
    const subs = this.getSubscriptions();
    const exportObj = {
      app: 'SubTrack',
      version: '1.0',
      exportDate: new Date().toISOString(),
      subscriptions: subs,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `subtrack_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  /**
   * JSON dosyasından içe aktarır
   */
  importData(jsonContent) {
    try {
      const parsed = JSON.parse(jsonContent);
      const list = Array.isArray(parsed) ? parsed : parsed.subscriptions;
      if (Array.isArray(list)) {
        const normalized = normalizeSubscriptionList(list);
        this.saveAllSubscriptions(normalized);
        return { success: true, count: normalized.length };
      }
      return { success: false, error: 'Geçersiz veri biçimi' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

};
