-- ============================================================
-- Mini CRM · esquema de base de datos para Supabase
-- Cómo usarlo: Supabase → SQL Editor → New query → pega TODO → Run
-- Cada usuario solo ve y modifica sus propios datos (Row Level Security).
-- ============================================================

create table if not exists public.clientes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nombre      text not null,
  empresa     text not null default '',
  email       text not null default '',
  telefono    text not null default '',
  etapa       text not null default 'lead'
              check (etapa in ('lead','contactado','negociacion','ganado','perdido')),
  valor       numeric(12,2) not null default 0 check (valor >= 0),
  origen      text not null default '',
  notas       text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.interacciones (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  cliente_id  uuid not null references public.clientes(id) on delete cascade,
  tipo        text not null default 'nota'
              check (tipo in ('nota','llamada','email','reunion')),
  detalle     text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.tareas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  cliente_id  uuid references public.clientes(id) on delete cascade,
  titulo      text not null,
  vence       date,
  hecha       boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists clientes_user_idx       on public.clientes (user_id);
create index if not exists interacciones_user_idx  on public.interacciones (user_id, cliente_id);
create index if not exists tareas_user_idx         on public.tareas (user_id, hecha, vence);

-- ---------- Row Level Security ----------
alter table public.clientes      enable row level security;
alter table public.interacciones enable row level security;
alter table public.tareas        enable row level security;

drop policy if exists "clientes: solo el dueño" on public.clientes;
create policy "clientes: solo el dueño" on public.clientes
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "interacciones: solo el dueño" on public.interacciones;
create policy "interacciones: solo el dueño" on public.interacciones
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "tareas: solo el dueño" on public.tareas;
create policy "tareas: solo el dueño" on public.tareas
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
