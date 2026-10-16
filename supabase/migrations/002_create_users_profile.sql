-- Users（auth.users と1:1で紐づくプロフィールテーブル）
create table public.users (
  id    uuid primary key references auth.users(id) on delete cascade,
  name  text not null,
  email text not null unique
);

alter table public.users enable row level security;

create policy "Users can manage their own profile"
  on public.users for all
  using (auth.uid() = id);
