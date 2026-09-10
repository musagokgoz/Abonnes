import React from 'react';
import { Plus, Bell, Settings } from 'lucide-react';
import AbonnesLogo from './AbonnesLogo';

export default function Header({
  onOpenAddModal,
  onOpenSettings,
  onOpenNotifications,
  alertsCount = 0,
  userEmail,
  onSignOut,
}) {
  return (
    <header className="border-b border-slate-900/80 bg-slate-950/90 backdrop-blur-lg sticky top-0 z-30 mb-5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Sol: Logo ve İsim */}
        <div className="flex items-center gap-2.5">
          <AbonnesLogo className="w-9 h-9" size={24} />
          <span className="text-xl font-black tracking-tight text-white">Abonnes</span>
        </div>

        {/* Sağ: Eylemler */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Bildirim & Hatırlatıcılar Butonu (Kırmızı Bildirim Rozeti ile) */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-2xl transition-all cursor-pointer"
            title="Bildirimler ve Hatırlatıcılar"
          >
            <Bell className="w-5 h-5" />
            {alertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>

          {/* Ayarlar */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-2xl transition-all cursor-pointer"
            title="Ayarlar & Yedekleme"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={onSignOut}
            className="hidden sm:block max-w-32 truncate px-2 text-[11px] text-slate-400 hover:text-white"
            title="Çıkış yap"
          >
            {userEmail}
          </button>

          {/* Yeni Abonelik Ekle Butonu */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-2xl text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all shadow-sm cursor-pointer ml-1"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
