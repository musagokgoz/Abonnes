import React from 'react';
import { X, BellRing, AlertTriangle, ShieldCheck, Share, Check } from 'lucide-react';

export default function NotificationModal({
  isOpen,
  onClose,
  alerts,
  permissionStatus,
  onRequestPermission,
  onSendTestNotification,
}) {
  if (!isOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Üst Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Bildirimler & Hatırlatıcılar</h2>
              <p className="text-xs text-slate-400">Deneme ve ödeme alarmlarınız</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* 1. Sistem Bildirimi Durumu & İzin */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Telefon / Kilit Ekranı Bildirimleri:</span>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  permissionStatus === 'granted'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {permissionStatus === 'granted' ? 'Açık' : 'Kapalı / İzin Bekliyor'}
              </span>
            </div>

            {permissionStatus === 'granted' ? (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4" />
                  <span>Sistem bildirimleri aktif</span>
                </span>
                <button
                  type="button"
                  onClick={onSendTestNotification}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
                >
                  Test Bildirimi Gönder
                </button>
              </div>
            ) : (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onRequestPermission}
                  className="w-full py-2.5 px-4 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 active:scale-98 transition-all shadow-md shadow-emerald-950/30 cursor-pointer"
                >
                  Sistem Bildirim İznini Aç
                </button>
              </div>
            )}
          </div>

          {/* iPhone Özel Bilgilendirme Kutusu (Eğer Safari Sekmesindeyse) */}
          {isIOS && !isStandalone && (
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300">
                <Share className="w-4 h-4" />
                <h4 className="text-xs font-bold">iPhone (iOS) Bildirim Kuralı</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Apple, spam siteleri engellemek için Safari sekmelerinde bildirimleri kilitler. iPhone kilit ekranınıza bildirim gelebilmesi için:
              </p>
              <ol className="text-xs text-slate-300 space-y-1.5 pl-1 pt-1">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Safari altındaki <strong>Paylaş</strong> (kare ve yukarı ok) simgesine basın.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span><strong>"Ana Ekrana Ekle"</strong> seçeneğini seçin.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Ana ekrandaki <strong>Abonnes</strong> uygulamasını açıp zile basın.</span>
                </li>
              </ol>
            </div>
          )}

          {/* 2. Aktif Hatırlatıcılar & Alarmlar Listesi */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Aktif Hatırlatıcılarınız ({alerts.length})
            </h3>

            {alerts.length > 0 ? (
              <div className="space-y-2.5">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                        : alert.severity === 'warning'
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-2xl bg-slate-950/40 border border-slate-800/60">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-medium text-slate-300">
                  Şu an için yaklaşan kritik bir deneme veya ödeme yok.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
