-- Lines v1 schema. Apply in a Supabase project when you leave local seed data.
-- Party-of-N is the unit. No city map tables yet.
-- TODO: add RLS policies before wiring a Supabase client. RLS is on with zero
-- policies, so PostgREST will deny all reads/writes until policies exist.

create table if not exists venues (
  id text primary key,
  name text not null,
  neighborhood text not null,
  capacity integer not null check (capacity > 0),
  occupancy integer not null default 0,
  vibe text not null default ''
);

create table if not exists deals (
  id text primary key,
  venue_id text not null references venues (id) on delete cascade,
  title text not null,
  detail text not null
);

create table if not exists parties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size integer not null check (size between 1 and 16),
  invite_code text not null unique
);

create table if not exists queue_entries (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references venues (id) on delete cascade,
  party_id uuid not null references parties (id) on delete cascade,
  status text not null default 'waiting'
    check (status in ('waiting', 'called', 'admitted', 'no_show')),
  joined_at timestamptz not null default now(),
  notified_third boolean not null default false,
  notified_next boolean not null default false
);

create index if not exists queue_entries_venue_active
  on queue_entries (venue_id, joined_at)
  where status in ('waiting', 'called');

create table if not exists door_events (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references venues (id) on delete cascade,
  queue_entry_id uuid not null references queue_entries (id) on delete cascade,
  action text not null check (action in ('called', 'admitted', 'no_show')),
  created_at timestamptz not null default now()
);

alter table venues enable row level security;
alter table deals enable row level security;
alter table parties enable row level security;
alter table queue_entries enable row level security;
alter table door_events enable row level security;
