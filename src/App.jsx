import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AuthScreen from './components/AuthScreen';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import TrialAlertBanner from './components/TrialAlertBanner';
import SubscriptionFilter from './components/SubscriptionFilter';
import SubscriptionCard from './components/SubscriptionCard';
import SubscriptionModal from './components/SubscriptionModal';
import NotificationModal from './components/NotificationModal';
import { cloudStorageService } from './services/cloudStorageService';
import { supabase } from './services/supabaseClient';
import { notificationService } from './services/notificationService';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Sparkles, Inbox } from 'lucide-react';
import confetti from 'canvas-confetti';

function isUpcomingSubscription(subscription, today) {
  const dateString = subscription.is_trial && subscription.trial_end_date
    ? subscription.trial_end_date
    : subscription.next_billing_date;

  if (!dateString) return false;

  try {
    const daysUntilDue = differenceInCalendarDays(parseISO(dateString), today);
    return daysUntilDue >= 0 && daysUntilDue <= 7;
  } catch {
    return false;
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Filtreler
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'trials' | 'upcoming'
  const [searchQuery, setSearchQuery] = useState('');

  // Modallar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const refreshData = useCallback(async () => {
    if (!user) return;
    try {
      const list = await cloudStorageService.getSubscriptions(user.id);
      setSubscriptions(list);
      setAlerts(notificationService.checkDueAlerts(list));
    } catch (error) {
      showToast(`Veriler yüklenemedi: ${error.message}`);
    }
  }, [showToast, user]);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setUser(data.session?.user ?? null);
        setIsAuthLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      refreshData();
      setNotificationPermission(notificationService.getPermissionStatus());
    } else {
      setSubscriptions([]);
      setAlerts([]);
    }
  }, [refreshData, user]);

  const handleRequestPermission = async () => {
    const res = await notificationService.requestPermission();
    const currentPerm = notificationService.getPermissionStatus();
    setNotificationPermission(currentPerm);

    if (res.status === 'granted') {
      showToast('🔔 Bildirim izni başarıyla verildi!');
      notificationService.sendTestNotification();
    } else if (res.status === 'ios_safari_tab') {
      showToast('📲 iPhone: Safari yerine "Ana Ekrana Ekle" simgesinden açmalısınız.');
    } else if (res.status === 'insecure') {
      showToast('🔒 iPhone için HTTPS gereklidir.');
    } else {
      showToast(res.reason || '⚠️ Bildirim izni verilemedi.');
    }
  };

  const handleSendTestNotification = async () => {
    const sent = await notificationService.sendTestNotification();
    if (sent) {
      showToast('🔔 Test bildirimi iletildi!');
    } else {
      showToast('Sistem bildirim izni henüz açık değil.');
    }
  };

  const handleSaveSubscription = async (subData) => {
    try {
      if (editingSub) {
        await cloudStorageService.updateSubscription(subData, user.id);
        showToast(`✅ "${subData.custom_name}" güncellendi.`);
      } else {
        await cloudStorageService.addSubscription({
          ...subData,
          subscription_id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        }, user.id);
        showToast(`🎉 "${subData.custom_name}" eklendi!`);
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      }
      setEditingSub(null);
      await refreshData();
    } catch (error) {
      showToast(`Kayıt başarısız: ${error.message}`);
    }
  };

  const handleDeleteSubscription = async (id) => {
    const sub = subscriptions.find((s) => s.subscription_id === id);
    if (confirm(`"${sub?.custom_name}" aboneliğini silmek istediğinizden emin misiniz?`)) {
      try {
        await cloudStorageService.deleteSubscription(id, user.id);
        showToast(`🗑️ "${sub?.custom_name}" silindi.`);
        await refreshData();
      } catch (error) {
        showToast(`Silme başarısız: ${error.message}`);
      }
    }
  };

  const handleMarkCancelled = async (id) => {
    const sub = subscriptions.find((s) => s.subscription_id === id);
    try {
      await cloudStorageService.cancelSubscription(id, user.id);
      showToast(`🥳 Tebrikler! "${sub?.custom_name}" iptal edildi!`);
      await refreshData();
    } catch (error) {
      showToast(`İptal kaydedilemedi: ${error.message}`);
    }
  };

  // Filtreleme
  const filteredSubscriptions = useMemo(() => {
    const today = new Date();

    return subscriptions
      .filter((sub) => {
        if (sub.status === 'cancelled') return activeTab === 'all';
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = sub.custom_name?.toLowerCase().includes(q);
          const matchCard = sub.payment_method_note?.toLowerCase().includes(q);
          if (!matchName && !matchCard) return false;
        }

        if (activeTab === 'trials') {
          return sub.is_trial;
        } else if (activeTab === 'upcoming') {
          return isUpcomingSubscription(sub, today);
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = a.is_trial && a.trial_end_date ? a.trial_end_date : a.next_billing_date || '9999-12-31';
        const dateB = b.is_trial && b.trial_end_date ? b.trial_end_date : b.next_billing_date || '9999-12-31';
        return dateA.localeCompare(dateB);
      });
  }, [subscriptions, searchQuery, activeTab]);

  const counts = useMemo(() => {
    const today = new Date();
    const activeSubscriptions = subscriptions.filter((s) => s.status !== 'cancelled');
    const trials = activeSubscriptions.filter((s) => s.is_trial).length;
    const upcoming = activeSubscriptions.filter((subscription) => isUpcomingSubscription(subscription, today)).length;

    return { all: subscriptions.length, trials, upcoming };
  }, [subscriptions]);

  if (isAuthLoading) {
    return <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm">Yükleniyor...</div>;
  }

  if (!user) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Üst Çubuk */}
      <Header
        onOpenAddModal={() => {
          setEditingSub(null);
          setIsModalOpen(true);
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        alertsCount={alerts.length}
        onSignOut={() => supabase.auth.signOut()}
      />

      {/* Bildirim Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Ana Gövde */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pb-16">
        {/* Acil Deneme Süresi Uyarısı */}
        <TrialAlertBanner alerts={alerts} onMarkCancelled={handleMarkCancelled} />

        {/* Ferah İstatistikler */}
        <DashboardStats subscriptions={subscriptions} />

        {/* Sadeleştirilmiş Sekmeler ve Arama */}
        <SubscriptionFilter
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          counts={counts}
        />

        {/* Abonelik Kartları */}
        {filteredSubscriptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredSubscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.subscription_id}
                subscription={sub}
                onEdit={(item) => {
                  setEditingSub(item);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteSubscription}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/30 p-10 text-center my-6">
            <Inbox className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Abonelik Bulunamadı</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
              Bu filtrede henüz bir abonelik bulunmuyor.
            </p>
            <button
              onClick={() => {
                setEditingSub(null);
                setIsModalOpen(true);
              }}
              className="text-xs font-bold px-4 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 transition-all cursor-pointer"
            >
              + Abonelik Ekle
            </button>
          </div>
        )}
      </main>

      {/* Sade Footer */}
      <footer className="border-t border-slate-900 py-5 text-center text-xs text-slate-500">
        Abonnes — Sade & Akıllı Abonelik Takipçisi
      </footer>

      {/* Bildirimler Modalı */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={alerts}
        permissionStatus={notificationPermission}
        onRequestPermission={handleRequestPermission}
        onSendTestNotification={handleSendTestNotification}
      />

      {/* Ekle / Düzenle Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSub(null);
        }}
        onSave={handleSaveSubscription}
        editingSubscription={editingSub}
      />

    </div>
  );
}
