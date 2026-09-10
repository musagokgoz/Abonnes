import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import BrandLogo from './BrandLogo';

export default function TrialAlertBanner({ alerts, onMarkCancelled }) {
  const trialAlerts = alerts.filter(
    (a) => a.type === 'trial_ending' || a.type === 'trial_expired'
  );

  if (trialAlerts.length === 0) return null;

  const handleCelebrateCancel = (sub) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    if (onMarkCancelled) {
      onMarkCancelled(sub.subscription_id);
    }
  };

  return (
    <div className="mb-5 space-y-3">
      {trialAlerts.map((alert) => {
        const sub = alert.subscription;
        const isExpired = alert.daysLeft < 0;

        return (
          <div
            key={alert.id}
            className={`rounded-3xl border p-4 sm:p-5 transition-all ${
              isExpired
                ? 'bg-rose-950/30 border-rose-600/40'
                : 'bg-amber-950/25 border-amber-500/40'
            }`}
          >
            <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <BrandLogo
                  serviceId={sub.service_id}
                  name={sub.custom_name}
                  className="w-11 h-11 rounded-2xl shrink-0"
                  size={24}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isExpired
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {isExpired
                        ? 'Süresi Doldu!'
                        : alert.daysLeft === 0
                        ? 'Bugün Doluyor!'
                        : `Son ${alert.daysLeft} Gün!`}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                    {sub.custom_name} Denemesi
                  </h3>
                </div>
              </div>

              {/* Tutar */}
              <div className="text-right shrink-0">
                <span className="text-sm font-black text-white">
                  {sub.price} {sub.currency}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-3.5">
              Otomatik para çekilmemesi için denemeyi resmi sayfasından iptal edebilirsiniz.
            </p>

            {/* Butonlar */}
            <div className="flex items-center gap-2">
              {sub.cancel_url && (
                <a
                  href={sub.cancel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-500 transition-all cursor-pointer active:scale-98 text-center"
                >
                  <span>Aboneliği İptal Et</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => handleCelebrateCancel(sub)}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold rounded-xl text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/40 transition-all cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>İptal Ettim</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
