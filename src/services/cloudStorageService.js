import { supabase } from './supabaseClient';

const CACHE_PREFIX = 'abonnes_subscriptions_cache_';

function cacheKey(userId) {
  return `${CACHE_PREFIX}${userId}`;
}

function readCachedSubscriptions(userId) {
  try {
    const cached = localStorage.getItem(cacheKey(userId));
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function cacheSubscriptions(userId, subscriptions) {
  try {
    localStorage.setItem(cacheKey(userId), JSON.stringify(subscriptions));
  } catch (error) {
    console.warn('Offline abonelik önbelleği kaydedilemedi:', error);
  }
}

function mapSubscription(row) {
  return {
    ...row,
    subscription_id: row.subscription_id,
    user_id: row.user_id,
    cancelledAt: row.cancelled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapForDatabase(subscription, userId) {
  return {
    subscription_id: subscription.subscription_id,
    user_id: userId,
    service_id: subscription.service_id || '',
    custom_name: subscription.custom_name,
    category: subscription.category || 'Other',
    price: Number(subscription.price) || 0,
    currency: subscription.currency || 'TRY',
    billing_cycle: subscription.billing_cycle || 'monthly',
    start_date: subscription.start_date || null,
    next_billing_date: subscription.next_billing_date || null,
    is_trial: Boolean(subscription.is_trial),
    trial_end_date: subscription.trial_end_date || null,
    cancel_url: subscription.cancel_url || null,
    payment_method_note: subscription.payment_method_note || null,
    notifications_enabled: subscription.notifications_enabled !== false,
    reminder_days_before: subscription.reminder_days_before || [3, 1],
    status: subscription.status === 'cancelled' ? 'cancelled' : 'active',
    cancelled_at: subscription.cancelledAt || null,
  };
}

function ensureSuccess(result) {
  if (result.error) throw result.error;
  return result.data;
}

export const cloudStorageService = {
  async getSubscriptions(userId) {
    try {
      const result = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('next_billing_date', { ascending: true, nullsFirst: false });
      const subscriptions = (ensureSuccess(result) || []).map(mapSubscription);
      cacheSubscriptions(userId, subscriptions);
      return subscriptions;
    } catch (error) {
      const cached = readCachedSubscriptions(userId);
      if (cached) return cached;
      throw error;
    }
  },

  async addSubscription(subscription, userId) {
    const result = await supabase
      .from('subscriptions')
      .insert(mapForDatabase(subscription, userId))
      .select()
      .single();
    const saved = mapSubscription(ensureSuccess(result));
    cacheSubscriptions(userId, await this.getSubscriptions(userId));
    return saved;
  },

  async updateSubscription(subscription, userId) {
    const result = await supabase
      .from('subscriptions')
      .update(mapForDatabase(subscription, userId))
      .eq('subscription_id', subscription.subscription_id)
      .eq('user_id', userId)
      .select()
      .single();
    const saved = mapSubscription(ensureSuccess(result));
    cacheSubscriptions(userId, await this.getSubscriptions(userId));
    return saved;
  },

  async deleteSubscription(id, userId) {
    const result = await supabase
      .from('subscriptions')
      .delete()
      .eq('subscription_id', id)
      .eq('user_id', userId);
    ensureSuccess(result);
    cacheSubscriptions(userId, (readCachedSubscriptions(userId) || []).filter((subscription) => subscription.subscription_id !== id));
  },

  async cancelSubscription(id, userId) {
    const result = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        notifications_enabled: false,
      })
      .eq('subscription_id', id)
      .eq('user_id', userId)
      .select()
      .single();
    const saved = mapSubscription(ensureSuccess(result));
    cacheSubscriptions(userId, await this.getSubscriptions(userId));
    return saved;
  },

  async importSubscriptions(subscriptions, userId) {
    const rows = subscriptions.map((subscription) => mapForDatabase(subscription, userId));
    const result = await supabase.from('subscriptions').upsert(rows, { onConflict: 'subscription_id' }).select();
    const imported = (ensureSuccess(result) || []).map(mapSubscription);
    cacheSubscriptions(userId, await this.getSubscriptions(userId));
    return imported;
  },
};
