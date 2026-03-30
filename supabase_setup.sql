-- Run this script in your Supabase SQL Editor to create the profile table.

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  first_name text,
  last_name text,
  nickname text,
  callsign text,
  telephone text,
  birthdate date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policy to allow users to see their own profile
create policy "Users can view their own profiles"
on public.profiles for select
using ( auth.uid() = id );

-- Policy to allow users to update their own profile
create policy "Users can update their own profiles"
on public.profiles for update
using ( auth.uid() = id );

-- Policy to allow users to insert their own profile
create policy "Users can insert their own profiles"
on public.profiles for insert
with check ( auth.uid() = id );
