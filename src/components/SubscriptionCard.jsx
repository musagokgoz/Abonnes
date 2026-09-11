import React from 'react';
import { ExternalLink, Edit3, Trash2, Calendar, CreditCard, Clock } from 'lucide-react';
import { differenceInCalendarDays, parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { formatCurrency } from '../services/currencyService';
import BrandLogo from './BrandLogo';

export default function SubscriptionCard({ subscription, onEdit, onDelete }) {
  const today = new Date();

  // Hedef tarih
  const targetDateStr = subscription.is_trial && subscription.trial_end_date
    ? subscription.trial_end_date
    : subscription.next_billing_date;

  let daysLeft = null;
  let formattedDate = '-';

  if (targetDateStr) {
    try {
      const parsedDate = parseISO(targetDateStr);
      daysLeft = differenceInCalendarDays(parsedDate, today);
      formattedDate = format(parsedDate, 'd MMMM', { locale: tr });
    } catch (e) {
      console.error('Tarih hatası:', e);
    }
  }

  const isExpired = daysLeft !== null && daysLeft < 0;
  const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
  return (
    <div className={`rounded-3xl border bg-slate-900/60 p-5 transition-all flex flex-col justify-between ${
      subscription.is_trial && isUrgent
        ? 'border-amber-500/50 bg-amber-950/10'
        : 'border-slate-800/80 hover:border-slate-700'
    }`}>
      <div>
        {/* Üst Kısım: Logo, İsim ve Fiyat */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo
              serviceId={subscription.service_id}
              name={subscription.custom_name}
              className="w-12 h-12 rounded-2xl"
              size={26}
            />
            <div className="min-w-0">
              <h3 className="font-bold text-white text-base leading-snug truncate">
                {subscription.custom_name}
              </h3>
              {subscription.payment_method_note ? (
                <p className="text-xs text-slate-400 mt-0.5 truncate flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>{subscription.payment_method_note}</span>
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-0.5 capitalize">
                  {subscription.category || 'Abonelik'}
                </p>
              )}
            </div>
          </div>

          {/* Fiyat */}
          <div className="text-right shrink-0">
            <div className="text-lg font-black text-white tracking-tight">
              {formatCurrency(subscription.price, subscription.currency)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {subscription.billing_cycle === 'yearly' ? 'yıllık' : subscription.billing_cycle === 'weekly' ? 'haftalık' : 'aylık'}
            </div>
          </div>
        </div>

        {/* Orta Kısım: Durum & Tarih Bilgisi */}
        <div className="flex items-center justify-between py-2.5 px-3 rounded-2xl bg-slate-950/50 mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            {subscription.is_trial ? (
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span>{subscription.is_trial ? 'Deneme Bitişi:' : 'Yenilenme:'}</span>
            <strong className="text-white font-semibold">{formattedDate}</strong>
          </div>

          {daysLeft !== null && (
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isExpired
                  ? 'bg-rose-500/20 text-rose-300'
                  : isUrgent
                  ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                  : subscription.is_trial
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isExpired
                ? 'Bitti!'
                : daysLeft === 0
                ? 'Bugün!'
                : `${daysLeft} gün`}
            </span>
          )}
        </div>
      </div>

      {/* Alt Kısım: Butonlar */}
      <div className="flex items-center gap-2 pt-2">
        {subscription.cancel_url ? (
          <a
            href={subscription.cancel_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl text-slate-200 bg-slate-800/80 hover:bg-rose-600 hover:text-white transition-all cursor-pointer border border-slate-700/60 active:scale-98"
          >
            <span>Aboneliği İptal Et</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <div className="flex-1 text-center py-2 text-xs text-slate-500">
            İptal linki yok
          </div>
        )}

        <button
          onClick={() => onEdit(subscription)}
          className="p-2.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          title="Düzenle"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(subscription.subscription_id)}
          className="p-2.5 text-slate-400 hover:text-rose-400 bg-slate-800/50 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
          title="Sil"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
