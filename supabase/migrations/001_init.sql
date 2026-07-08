-- Users は Supabase Auth の auth.users を使用するため作成不要

-- FamilyMembers
create table public.family_members (
  members_id uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  created_at timestamptz default now()
);

-- Tags
create table public.tags (
  tag_id   uuid primary key default gen_random_uuid(),
  tag_name text not null unique
);

-- Goods
create table public.goods (
  goods_id       uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  member_id      uuid references public.family_members(members_id) on delete set null,
  title          text not null,
  text           text,
  price          numeric(10, 2) not null default 0,
  status         text not null check (status in ('keep', 'to_sell', 'archived')) default 'keep',
  archive_method text check (archive_method in ('donated', 'sold', 'recycled', 'other')),
  archive_reason text,
  images         text[] default '{}',
  created_at     timestamptz default now(),
  archived_at    timestamptz
);

-- Goods_Tags（中間テーブル）
create table public.goods_tags (
  tag_id   uuid not null references public.tags(tag_id) on delete cascade,
  goods_id uuid not null references public.goods(goods_id) on delete cascade,
  primary key (tag_id, goods_id)
);

-- RLS（Row Level Security）有効化
alter table public.family_members enable row level security;
alter table public.goods enable row level security;
alter table public.tags enable row level security;
alter table public.goods_tags enable row level security;

-- RLSポリシー: 自分のデータのみ操作可能
create policy "Users can manage their own goods"
  on public.goods for all
  using (auth.uid() = user_id);

create policy "Users can manage their own family members"
  on public.family_members for all
  using (auth.uid() = user_id);

create policy "Tags are readable by all authenticated users"
  on public.tags for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert tags"
  on public.tags for insert
  with check (auth.role() = 'authenticated');

create policy "Goods tags are accessible with goods"
  on public.goods_tags for all
  using (
    exists (
      select 1 from public.goods
      where goods.goods_id = goods_tags.goods_id
        and goods.user_id = auth.uid()
    )
  );
