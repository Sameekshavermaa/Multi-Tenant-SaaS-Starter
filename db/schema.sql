-- Extensions
create extension if not exists "pgcrypto";

-- Organizations
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  created_at timestamptz not null default now()
);

-- Memberships
create table if not exists memberships (
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null,
  user_email text not null,
  role text not null check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

-- Invitations
create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'member')),
  token text not null unique,
  invited_by uuid not null,
  status text not null check (status in ('pending', 'accepted', 'declined')) default 'pending',
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Subscriptions
create table if not exists subscriptions (
  organization_id uuid primary key references organizations(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  updated_at timestamptz not null default now()
);

-- Audit logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  actor_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Usage analytics
create table if not exists usage_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  actor_id uuid,
  event_name text not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table organizations enable row level security;
alter table memberships enable row level security;
alter table invitations enable row level security;
alter table subscriptions enable row level security;
alter table audit_logs enable row level security;
alter table usage_events enable row level security;

-- Tenant isolation policies using memberships
create policy "org members can read organizations"
on organizations for select
using (
  exists (
    select 1 from memberships
    where memberships.organization_id = organizations.id
    and memberships.user_id = auth.uid()
  )
);

create policy "admins can mutate organizations"
on organizations for all
using (
  exists (
    select 1 from memberships
    where memberships.organization_id = organizations.id
    and memberships.user_id = auth.uid()
    and memberships.role = 'admin'
  )
)
with check (
  exists (
    select 1 from memberships
    where memberships.organization_id = organizations.id
    and memberships.user_id = auth.uid()
    and memberships.role = 'admin'
  )
);

create policy "members can read memberships"
on memberships for select
using (
  exists (
    select 1 from memberships self
    where self.organization_id = memberships.organization_id
    and self.user_id = auth.uid()
  )
);

create policy "admins manage memberships"
on memberships for all
using (
  exists (
    select 1 from memberships self
    where self.organization_id = memberships.organization_id
    and self.user_id = auth.uid()
    and self.role = 'admin'
  )
)
with check (
  exists (
    select 1 from memberships self
    where self.organization_id = memberships.organization_id
    and self.user_id = auth.uid()
    and self.role = 'admin'
  )
);

create policy "members read invitations"
on invitations for select
using (
  exists (
    select 1 from memberships
    where memberships.organization_id = invitations.organization_id
    and memberships.user_id = auth.uid()
  )
);

create policy "admins manage invitations"
on invitations for all
using (
  exists (
    select 1 from memberships
    where memberships.organization_id = invitations.organization_id
    and memberships.user_id = auth.uid()
    and memberships.role = 'admin'
  )
)
with check (
  exists (
    select 1 from memberships
    where memberships.organization_id = invitations.organization_id
    and memberships.user_id = auth.uid()
    and memberships.role = 'admin'
  )
);

create policy "members read subscriptions"
on subscriptions for select
using (
  exists (
    select 1 from memberships
    where memberships.organization_id = subscriptions.organization_id
    and memberships.user_id = auth.uid()
  )
);

create policy "service role writes subscriptions"
on subscriptions for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "members read audit logs"
on audit_logs for select
using (
  exists (
    select 1 from memberships
    where memberships.organization_id = audit_logs.organization_id
    and memberships.user_id = auth.uid()
  )
);

create policy "members read usage events"
on usage_events for select
using (
  exists (
    select 1 from memberships
    where memberships.organization_id = usage_events.organization_id
    and memberships.user_id = auth.uid()
  )
);

create policy "members write usage events"
on usage_events for insert
with check (
  exists (
    select 1 from memberships
    where memberships.organization_id = usage_events.organization_id
    and memberships.user_id = auth.uid()
  )
);
