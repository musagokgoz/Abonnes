import { supabase } from './supabaseClient';

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
    const result = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('next_billing_date', { ascending: true, nullsFirst: false });
    return (ensureSuccess(result) || []).map(mapSubscription);
  },

  async addSubscription(subscription, userId) {
    const result = await supabase
      .from('subscriptions')
      .insert(mapForDatabase(subscription, userId))
      .select()
      .single();
    return mapSubscription(ensureSuccess(result));
  },

  async updateSubscription(subscription, userId) {
    const result = await supabase
      .from('subscriptions')
      .update(mapForDatabase(subscription, userId))
      .eq('subscription_id', subscription.subscription_id)
      .eq('user_id', userId)
      .select()
      .single();
    return mapSubscription(ensureSuccess(result));
  },

  async deleteSubscription(id, userId) {
    const result = await supabase
      .from('subscriptions')
      .delete()
      .eq('subscription_id', id)
      .eq('user_id', userId);
    ensureSuccess(result);
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
    return mapSubscription(ensureSuccess(result));
  },

  async importSubscriptions(subscriptions, userId) {
    const rows = subscriptions.map((subscription) => mapForDatabase(subscription, userId));
    const result = await supabase.from('subscriptions').upsert(rows, { onConflict: 'subscription_id' }).select();
    return (ensureSuccess(result) || []).map(mapSubscription);
  },
};
