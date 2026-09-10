import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { addDays, addMonths, addYears, format } from 'date-fns';
import { SERVICES_LIBRARY } from '../data/servicesLibrary';
import BrandLogo from './BrandLogo';

function getNextBillingDate(billingCycle) {
  const today = new Date();
  if (billingCycle === 'weekly') return format(addDays(today, 7), 'yyyy-MM-dd');
  if (billingCycle === 'yearly') return format(addYears(today, 1), 'yyyy-MM-dd');
  return format(addMonths(today, 1), 'yyyy-MM-dd');
}

export default function SubscriptionModal({ isOpen, onClose, onSave, editingSubscription }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [isCustom, setIsCustom] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    service_id: '',
    custom_name: '',
    category: 'Streaming',
    cancel_url: '',
    price: 149.99,
    currency: 'TRY',
    billing_cycle: 'monthly',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    next_billing_date: getNextBillingDate('monthly'),
    is_trial: false,
    trial_end_date: '',
    payment_method_note: '',
    notifications_enabled: true,
  });

  useEffect(() => {
    if (editingSubscription) {
      setFormData(editingSubscription);
      const match = SERVICES_LIBRARY.find((s) => s.service_id === editingSubscription.service_id);
      setSelectedService(match || null);
      setIsCustom(!match);
    } else {
      setFormData({
        service_id: '',
        custom_name: '',
        category: 'Streaming',
        cancel_url: '',
        price: 149.99,
        currency: 'TRY',
        billing_cycle: 'monthly',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        next_billing_date: getNextBillingDate('monthly'),
        is_trial: false,
        trial_end_date: '',
        payment_method_note: '',
        notifications_enabled: true,
      });
      setSelectedService(null);
      setIsCustom(false);
    }
  }, [editingSubscription, isOpen]);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setIsCustom(false);
    const plan = service.default_plans?.[0] || {};
    const hasTrial = (plan.trial_days || 0) > 0;
    const trialEnd = hasTrial ? format(addDays(new Date(), plan.trial_days), 'yyyy-MM-dd') : '';

    setFormData((prev) => ({
      ...prev,
      service_id: service.service_id,
      custom_name: `${service.name} ${plan.plan_name || ''}`.trim(),
      category: service.category || 'Other',
      cancel_url: service.cancel_url || '',
      price: plan.price || 0,
      currency: plan.currency || 'TRY',
      billing_cycle: plan.billing_cycle || 'monthly',
      is_trial: hasTrial,
      trial_end_date: trialEnd,
      next_billing_date: hasTrial
        ? trialEnd
        : getNextBillingDate(plan.billing_cycle || 'monthly'),
    }));
  };

  const handleSelectPlan = (plan) => {
    const hasTrial = (plan.trial_days || 0) > 0;
    const trialEnd = hasTrial ? format(addDays(new Date(), plan.trial_days), 'yyyy-MM-dd') : '';

    setFormData((prev) => ({
      ...prev,
      custom_name: `${selectedService.name} ${plan.plan_name}`,
      price: plan.price,
      currency: plan.currency,
      billing_cycle: plan.billing_cycle,
      is_trial: hasTrial,
      trial_end_date: trialEnd,
      next_billing_date: hasTrial
        ? trialEnd
        : getNextBillingDate(plan.billing_cycle || 'monthly'),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.custom_name.trim()) return;
    onSave({
      ...formData,
      price: Number(formData.price) || 0,
    });
    onClose();
  };

  const filteredServices = SERVICES_LIBRARY.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Üst Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 shrink-0">
          <h2 className="text-base font-extrabold text-white">
            {editingSubscription ? 'Aboneliği Düzenle' : 'Yeni Abonelik Ekle'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Servis Seçim Izgarası */}
          {!editingSubscription && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Servis Seçin:</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustom(true);
                    setSelectedService(null);
                    setFormData((p) => ({ ...p, service_id: `custom_${Date.now()}`, custom_name: '' }));
                  }}
                  className="text-xs text-emerald-400 hover:underline font-medium"
                >
                  + Özel Servis
                </button>
              </div>

              {/* Arama */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Netflix, Spotify, ChatGPT..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Logolar */}
              {!isCustom && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                  {filteredServices.map((srv) => {
                    const isSelected = selectedService?.service_id === srv.service_id;
                    return (
                      <button
                        key={srv.service_id}
                        type="button"
                        onClick={() => handleSelectService(srv)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500/70 text-white font-bold ring-1 ring-emerald-500/30'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <BrandLogo serviceId={srv.service_id} name={srv.name} className="w-10 h-10 mb-1.5" size={22} />
                        <span className="text-xs truncate w-full">{srv.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Servisin Planları */}
              {selectedService?.default_plans?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedService.default_plans.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPlan(p)}
                      className="px-3 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 text-slate-200 cursor-pointer"
                    >
                      {p.plan_name} ({p.price} {p.currency})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Form Alanları */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Abonelik Adı *</label>
              <input
                type="text"
                required
                value={formData.custom_name}
                onChange={(e) => setFormData({ ...formData, custom_name: e.target.value })}
                placeholder="Örn: Netflix Standart"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Tutar & Periyot */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Tutar *</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-20 bg-slate-950 border border-slate-800 rounded-2xl px-2 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="TRY">₺ TRY</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Döngü</label>
                <select
                  value={formData.billing_cycle}
                  onChange={(e) => {
                    const billingCycle = e.target.value;
                    setFormData({
                      ...formData,
                      billing_cycle: billingCycle,
                      next_billing_date: getNextBillingDate(billingCycle),
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="monthly">Aylık</option>
                  <option value="yearly">Yıllık</option>
                  <option value="weekly">Haftalık</option>
                </select>
              </div>
            </div>

            {/* Deneme Kutusu */}
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="trial_check"
                  checked={formData.is_trial}
                  onChange={(e) => setFormData({ ...formData, is_trial: e.target.checked })}
                  className="w-4 h-4 text-amber-500 bg-slate-900 border-slate-700 rounded"
                />
                <label htmlFor="trial_check" className="text-xs font-bold text-amber-300 cursor-pointer">
                  Ücretsiz deneme süresinde mi?
                </label>
              </div>

              {formData.is_trial && (
                <div className="mt-2.5">
                  <label className="block text-[11px] text-slate-300 mb-1">Deneme Bitiş Tarihi:</label>
                  <input
                    type="date"
                    required={formData.is_trial}
                    value={formData.trial_end_date || ''}
                    onChange={(e) => setFormData({ ...formData, trial_end_date: e.target.value })}
                    className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Tarih ve Kart Notu */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Ödeme Tarihi *</label>
                <input
                  type="date"
                  required
                  value={formData.next_billing_date}
                  onChange={(e) => setFormData({ ...formData, next_billing_date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Kart Notu (Opsiyonel)</label>
                <input
                  type="text"
                  value={formData.payment_method_note}
                  onChange={(e) => setFormData({ ...formData, payment_method_note: e.target.value })}
                  placeholder="Enpara Sanal Kart"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* İptal Linki */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                İptal Sayfası Linki
              </label>
              <input
                type="url"
                value={formData.cancel_url}
                onChange={(e) => setFormData({ ...formData, cancel_url: e.target.value })}
                placeholder="https://netflix.com/youraccount"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            {/* Butonlar */}
            <div className="flex items-center justify-end gap-2.5 pt-3 pb-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-3 text-xs font-semibold rounded-2xl text-slate-400 hover:text-white bg-slate-800/60"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-3 text-xs font-bold rounded-2xl text-white bg-emerald-600 hover:bg-emerald-500 transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
              >
                {editingSubscription ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
