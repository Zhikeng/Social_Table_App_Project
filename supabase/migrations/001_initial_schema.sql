create extension if not exists btree_gist;
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  username      text not null unique,
  full_name     text,
  avatar_path   text,
  no_show_count integer not null default 0 check (no_show_count >= 0),
  created_at    timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'username', ''),
      'user_' || substr(new.id::text, 1, 8)
    ),
    nullif(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.restaurants (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  slug                   text not null unique,
  description            text,
  cover_photo_path       text,
  address                text,
  lat                    double precision,
  lng                    double precision,
  timezone               text not null default 'America/New_York',
  is_published           boolean not null default false,
  walk_in_cover_reserve  integer not null default 0
                           check (walk_in_cover_reserve >= 0),
  created_at             timestamptz not null default now(),
  constraint restaurants_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.seating_areas (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references public.restaurants (id) on delete cascade,
  name           text not null,
  created_at     timestamptz not null default now()
);

create table public.tables (
  id                  uuid primary key default gen_random_uuid(),
  restaurant_id       uuid not null references public.restaurants (id) on delete cascade,
  seating_area_id     uuid not null references public.seating_areas (id) on delete restrict,
  name                text not null,
  min_covers          integer not null check (min_covers >= 1),
  max_covers          integer not null,
  is_online_bookable  boolean not null default true,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  constraint tables_covers_ok check (max_covers >= min_covers)
);

create index tables_restaurant_id_idx on public.tables (restaurant_id);
create index tables_seating_area_id_idx on public.tables (seating_area_id);

create table public.restaurant_hours (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references public.restaurants (id) on delete cascade,
  day_of_week    smallint not null check (day_of_week between 0 and 6),
  open_time      time not null,
  close_time     time not null,
  unique (restaurant_id, day_of_week, open_time)
);

create table public.restaurant_services (
  id                        uuid primary key default gen_random_uuid(),
  restaurant_id             uuid not null references public.restaurants (id) on delete cascade,
  name                      text not null,
  start_time                time not null,
  end_time                  time not null,
  slot_interval_minutes     integer not null check (slot_interval_minutes > 0),
  default_duration_minutes  integer not null check (default_duration_minutes > 0)
);

create table public.restaurant_hour_exceptions (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references public.restaurants (id) on delete cascade,
  on_date        date not null,
  is_closed      boolean not null default true,
  open_time      time,
  close_time     time,
  note           text,
  unique (restaurant_id, on_date),
  constraint restaurant_hour_exceptions_times_when_open
    check (is_closed or (open_time is not null and close_time is not null))
);

create table public.reservations (
  id                 uuid primary key default gen_random_uuid(),
  restaurant_id      uuid not null references public.restaurants (id) on delete restrict,
  table_id           uuid references public.tables (id) on delete restrict,
  seating_area_id    uuid references public.seating_areas (id) on delete restrict,
  user_id            uuid not null references public.profiles (id) on delete restrict,
  party_size         integer not null check (party_size >= 1),
  start_at           timestamptz not null,
  end_at             timestamptz not null,
  status             text not null check (status in (
                       'held', 'confirmed', 'seated', 'completed',
                       'expired', 'cancelled', 'no_show'
                     )),
  hold_expires_at    timestamptz,
  special_requests   text,
  source             text,
  confirmation_code  text unique,
  no_show_at         timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint reservations_time_order check (end_at > start_at),
  constraint reservations_table_required_when_active
    check (status not in ('held', 'confirmed', 'seated') or table_id is not null),
  constraint reservations_hold_needs_expiry
    check (status <> 'held' or hold_expires_at is not null)
);

create index reservations_user_id_idx on public.reservations (user_id);
create index reservations_restaurant_id_idx on public.reservations (restaurant_id);
create index reservations_table_time_idx on public.reservations (table_id, start_at);

alter table public.reservations
  add constraint reservations_no_overlapping_table
  exclude using gist (
    table_id with =,
    tstzrange(start_at, end_at, '[)') with &&
  )
  where (table_id is not null and status in ('held', 'confirmed', 'seated'));

create trigger reservations_set_updated_at
  before update on public.reservations
  for each row execute procedure public.set_updated_at();

create or replace function public.reservations_party_fits_table()
returns trigger
language plpgsql
as $$
declare
  v_min integer;
  v_max integer;
begin
  if new.table_id is null then
    return new;
  end if;

  select min_covers, max_covers
    into v_min, v_max
  from public.tables
  where id = new.table_id;

  if v_min is null then
    raise exception 'table % not found', new.table_id;
  end if;

  if new.party_size < v_min or new.party_size > v_max then
    raise exception 'party_size % does not fit table covers %–%',
      new.party_size, v_min, v_max;
  end if;

  return new;
end;
$$;

create trigger reservations_party_fits_table
  before insert or update of table_id, party_size
  on public.reservations
  for each row execute procedure public.reservations_party_fits_table();

create or replace function public.reservations_track_no_show()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'no_show' and (old.status is distinct from 'no_show') then
    new.no_show_at = coalesce(new.no_show_at, now());
    update public.profiles
       set no_show_count = no_show_count + 1
     where id = new.user_id;
  end if;
  return new;
end;
$$;

create trigger reservations_track_no_show
  before update of status on public.reservations
  for each row execute procedure public.reservations_track_no_show();

create or replace function public.expire_reservation_holds()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.reservations
     set status = 'expired'
   where status = 'held'
     and hold_expires_at < now();

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create table public.waitlist_entries (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references public.restaurants (id) on delete cascade,
  user_id         uuid not null references public.profiles (id) on delete cascade,
  party_size      integer not null check (party_size >= 1),
  quoted_minutes  integer,
  status          text not null default 'waiting'
                    check (status in ('waiting', 'notified', 'seated', 'cancelled', 'expired')),
  notify_via      text,
  created_at      timestamptz not null default now(),
  notified_at     timestamptz,
  seated_at       timestamptz,
  expired_at      timestamptz
);

create index waitlist_entries_restaurant_status_idx
  on public.waitlist_entries (restaurant_id, status, created_at);

create table public.check_ins (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  restaurant_id   uuid not null references public.restaurants (id) on delete cascade,
  photo_path      text,
  caption         text,
  rating          smallint check (rating between 1 and 5),
  like_count      integer not null default 0 check (like_count >= 0),
  comment_count   integer not null default 0 check (comment_count >= 0),
  bookmark_count  integer not null default 0 check (bookmark_count >= 0),
  created_at      timestamptz not null default now()
);

create index check_ins_user_created_idx
  on public.check_ins (user_id, created_at desc);
create index check_ins_restaurant_created_idx
  on public.check_ins (restaurant_id, created_at desc);

create table public.check_in_likes (
  check_in_id  uuid not null references public.check_ins (id) on delete cascade,
  user_id      uuid not null references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (check_in_id, user_id)
);

create table public.check_in_comments (
  id           uuid primary key default gen_random_uuid(),
  check_in_id  uuid not null references public.check_ins (id) on delete cascade,
  user_id      uuid not null references public.profiles (id) on delete cascade,
  body         text not null,
  created_at   timestamptz not null default now()
);

create table public.check_in_bookmarks (
  check_in_id  uuid not null references public.check_ins (id) on delete cascade,
  user_id      uuid not null references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (check_in_id, user_id)
);

create or replace function public.bump_check_in_counter()
returns trigger
language plpgsql
as $$
declare
  v_col  text;
  v_id   uuid;
  v_delta integer;
begin
  v_col := tg_argv[0];
  if tg_op = 'INSERT' then
    v_id := new.check_in_id;
    v_delta := 1;
  else
    v_id := old.check_in_id;
    v_delta := -1;
  end if;

  execute format(
    'update public.check_ins set %I = %I + $1 where id = $2',
    v_col, v_col
  )
  using v_delta, v_id;

  return coalesce(new, old);
end;
$$;

create trigger check_in_likes_count
  after insert or delete on public.check_in_likes
  for each row execute procedure public.bump_check_in_counter('like_count');

create trigger check_in_comments_count
  after insert or delete on public.check_in_comments
  for each row execute procedure public.bump_check_in_counter('comment_count');

create trigger check_in_bookmarks_count
  after insert or delete on public.check_in_bookmarks
  for each row execute procedure public.bump_check_in_counter('bookmark_count');

create table public.notifications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  actor_id        uuid references public.profiles (id) on delete set null,
  type            text not null,
  check_in_id     uuid references public.check_ins (id) on delete cascade,
  reservation_id  uuid references public.reservations (id) on delete cascade,
  restaurant_id   uuid references public.restaurants (id) on delete cascade,
  is_read         boolean not null default false,
  created_at      timestamptz not null default now()
);

create index notifications_user_unread_idx
  on public.notifications (user_id, is_read, created_at desc);

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.seating_areas enable row level security;
alter table public.tables enable row level security;
alter table public.restaurant_hours enable row level security;
alter table public.restaurant_services enable row level security;
alter table public.restaurant_hour_exceptions enable row level security;
alter table public.reservations enable row level security;
alter table public.waitlist_entries enable row level security;
alter table public.check_ins enable row level security;
alter table public.check_in_likes enable row level security;
alter table public.check_in_comments enable row level security;
alter table public.check_in_bookmarks enable row level security;
alter table public.notifications enable row level security;

create policy profiles_select_all on public.profiles for select using (true);
create policy profiles_update_own on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy restaurants_select_published on public.restaurants for select using (is_published);
create policy restaurants_insert_authenticated on public.restaurants for insert to authenticated with check (auth.uid() is not null);
create policy restaurants_update_authenticated on public.restaurants for update to authenticated using (auth.uid() is not null);

create policy seating_areas_select on public.seating_areas for select using (exists (select 1 from public.restaurants r where r.id = seating_areas.restaurant_id and r.is_published));
create policy seating_areas_write_auth on public.seating_areas for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

create policy tables_select on public.tables for select using (exists (select 1 from public.restaurants r where r.id = tables.restaurant_id and r.is_published));
create policy tables_write_auth on public.tables for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

create policy restaurant_hours_select on public.restaurant_hours for select using (exists (select 1 from public.restaurants r where r.id = restaurant_hours.restaurant_id and r.is_published));
create policy restaurant_hours_write_auth on public.restaurant_hours for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

create policy restaurant_services_select on public.restaurant_services for select using (exists (select 1 from public.restaurants r where r.id = restaurant_services.restaurant_id and r.is_published));
create policy restaurant_services_write_auth on public.restaurant_services for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

create policy restaurant_hour_exceptions_select on public.restaurant_hour_exceptions for select using (exists (select 1 from public.restaurants r where r.id = restaurant_hour_exceptions.restaurant_id and r.is_published));
create policy restaurant_hour_exceptions_write_auth on public.restaurant_hour_exceptions for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

create policy reservations_select_own on public.reservations for select to authenticated using (user_id = auth.uid());
create policy reservations_insert_own on public.reservations for insert to authenticated with check (user_id = auth.uid());
create policy reservations_update_own on public.reservations for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy waitlist_select_own on public.waitlist_entries for select to authenticated using (user_id = auth.uid());
create policy waitlist_insert_own on public.waitlist_entries for insert to authenticated with check (user_id = auth.uid());
create policy waitlist_update_own on public.waitlist_entries for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy check_ins_select_all on public.check_ins for select using (true);
create policy check_ins_insert_own on public.check_ins for insert to authenticated with check (user_id = auth.uid());
create policy check_ins_update_own on public.check_ins for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy check_ins_delete_own on public.check_ins for delete to authenticated using (user_id = auth.uid());

create policy check_in_likes_select_all on public.check_in_likes for select using (true);
create policy check_in_likes_write_own on public.check_in_likes for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy check_in_comments_select_all on public.check_in_comments for select using (true);
create policy check_in_comments_insert_own on public.check_in_comments for insert to authenticated with check (user_id = auth.uid());
create policy check_in_comments_delete_own on public.check_in_comments for delete to authenticated using (user_id = auth.uid());

create policy check_in_bookmarks_select_own on public.check_in_bookmarks for select to authenticated using (user_id = auth.uid());
create policy check_in_bookmarks_write_own on public.check_in_bookmarks for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy notifications_select_own on public.notifications for select to authenticated using (user_id = auth.uid());
create policy notifications_update_own on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

grant usage on schema public to anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;

grant select on public.restaurants to anon, authenticated;
grant insert, update on public.restaurants to authenticated;

grant select on public.seating_areas, public.tables,
  public.restaurant_hours, public.restaurant_services,
  public.restaurant_hour_exceptions to anon, authenticated;
grant insert, update, delete on public.seating_areas, public.tables,
  public.restaurant_hours, public.restaurant_services,
  public.restaurant_hour_exceptions to authenticated;

grant select, insert, update on public.reservations to authenticated;
grant select, insert, update on public.waitlist_entries to authenticated;

grant select on public.check_ins, public.check_in_likes, public.check_in_comments
  to anon, authenticated;
grant insert, update, delete on public.check_ins to authenticated;
grant insert, delete on public.check_in_likes, public.check_in_comments to authenticated;
grant select, insert, delete on public.check_in_bookmarks to authenticated;

grant select, update on public.notifications to authenticated;