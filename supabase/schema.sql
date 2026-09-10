create table if not exists public.subscriptions (
  subscription_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  service_id text not null default '',
  custom_name text not null,
  category text not null default 'Other',
  price numeric(12, 2) not null default 0 check (price >= 0),
  currency text not null default 'TRY',
  billing_cycle text not null default 'monthly' check (billing_cycle in ('weekly', 'monthly', 'yearly')),
  start_date date,
  next_billing_date date,
  is_trial boolean not null default false,
  trial_end_date date,
  cancel_url text,
  payment_method_note text,
  notifications_enabled boolean not null default true,
  reminder_days_before integer[] not null default array[3, 1],
  status text not null default 'active' check (status in ('active', 'cancelled')),
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can read their subscriptions" on public.subscriptions;
create policy "Users can read their subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their subscriptions" on public.subscriptions;
create policy "Users can create their subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their subscriptions" on public.subscriptions;
create policy "Users can update their subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their subscriptions" on public.subscriptions;
create policy "Users can delete their subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_next_billing_date_idx on public.subscriptions(user_id, next_billing_date);
