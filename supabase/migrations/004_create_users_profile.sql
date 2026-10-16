-- Users（auth.users と1:1で紐づくプロフィールテーブル）
create table public.users_profile (
  -- id    uuid primary key references auth.users(id) on delete cascade,
  -- name  text not null,
  -- email text not null unique
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_currency text default 'USD',
  birthday date
);

alter table public.users_profile enable row level security;

create policy "Users can manage their own goods"
  on users_profile for all
  using (auth.uid() = user_id);