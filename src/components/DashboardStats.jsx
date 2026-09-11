import React from 'react';
import { convertCurrency, formatCurrency } from '../services/currencyService';
import { Clock } from 'lucide-react';

export default function DashboardStats({ subscriptions, primaryCurrency = 'TRY', exchangeRates }) {
  const activeSubscriptions = subscriptions.filter((sub) => sub.status !== 'cancelled');
  const monthlyTotalTRY = activeSubscriptions.reduce((sum, sub) => {
    let monthlyPrice = Number(sub.price) || 0;
    if (sub.billing_cycle === 'yearly') {
      monthlyPrice = monthlyPrice / 12;
    } else if (sub.billing_cycle === 'weekly') {
      monthlyPrice = (monthlyPrice * 52) / 12;
    }
    return sum + convertCurrency(monthlyPrice, sub.currency, primaryCurrency, exchangeRates);
  }, 0);

  const yearlyTotalTRY = monthlyTotalTRY * 12;
  const activeCount = activeSubscriptions.length;
  const trialCount = activeSubscriptions.filter((s) => s.is_trial).length;

  return (
    <div className="mb-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800/60 p-5 sm:p-7 text-center sm:text-left relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        {/* Sol: Büyük Aylık Tutar */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Aylık Toplam Harcama
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {formatCurrency(monthlyTotalTRY, primaryCurrency)}
          </div>
        </div>

        {/* Sağ: İkincil Rozetler */}
        <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap pt-2 sm:pt-0">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{activeCount} Aktif Servis</span>
          </div>

          {trialCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-medium text-amber-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{trialCount} Deneme</span>
            </div>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-800 text-xs text-slate-400 hidden sm:flex items-center gap-1">
            <span>Yıllık:</span>
            <strong className="text-slate-200">{formatCurrency(yearlyTotalTRY, primaryCurrency)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
