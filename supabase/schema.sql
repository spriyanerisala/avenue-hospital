-- ==========================================================
-- AVENUE MULTI-SPECIALTY HOSPITAL - DATABASE SCHEMA
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    email text not null,
    phone text,
    avatar_url text,
    role text not null default 'patient' check (role in ('patient', 'doctor', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. DEPARTMENTS TABLE
create table if not exists public.departments (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text unique not null,
    description text not null,
    image_url text not null,
    icon text default 'Activity',
    head_doctor text,
    phone text,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. DOCTORS TABLE
create table if not exists public.doctors (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid references public.profiles(id) on delete set null,
    department_id uuid references public.departments(id) on delete set null,
    name text not null,
    email text,
    phone text,
    specialization text not null,
    qualification text not null,
    experience_years integer not null default 1,
    consultation_fee numeric(10,2) not null default 500.00,
    bio text,
    image_url text not null,
    rating numeric(3,2) default 4.90,
    review_count integer default 12,
    is_featured boolean default false,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. DOCTOR AVAILABILITY TABLE
create table if not exists public.doctor_availability (
    id uuid primary key default uuid_generate_v4(),
    doctor_id uuid not null references public.doctors(id) on delete cascade,
    day_of_week integer not null check (day_of_week between 0 and 6), -- 0=Sun, 1=Mon, ..., 6=Sat
    start_time time not null,
    end_time time not null,
    slot_duration_minutes integer default 30,
    is_available boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_doctor_day unique (doctor_id, day_of_week)
);

-- 5. APPOINTMENTS TABLE
create table if not exists public.appointments (
    id uuid primary key default uuid_generate_v4(),
    patient_id uuid references public.profiles(id) on delete set null,
    doctor_id uuid not null references public.doctors(id) on delete cascade,
    department_id uuid references public.departments(id) on delete set null,
    appointment_date date not null,
    appointment_time time not null,
    appointment_type text default 'In-Person' check (appointment_type in ('In-Person', 'Online Consultation')),
    status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
    reason text,
    patient_name text not null,
    patient_email text not null,
    patient_phone text not null,
    patient_age integer,
    patient_gender text,
    payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for doctor appointment lookup & conflict prevention
create index if not exists idx_appointments_slot 
on public.appointments(doctor_id, appointment_date, appointment_time, status);

-- 6. PAYMENTS TABLE
create table if not exists public.payments (
    id uuid primary key default uuid_generate_v4(),
    appointment_id uuid references public.appointments(id) on delete set null,
    razorpay_order_id text unique,
    razorpay_payment_id text unique,
    razorpay_signature text,
    amount numeric(10,2) not null,
    currency text default 'INR',
    status text default 'created' check (status in ('created', 'captured', 'failed', 'refunded')),
    method text,
    receipt text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. REVIEWS TABLE
create table if not exists public.reviews (
    id uuid primary key default uuid_generate_v4(),
    doctor_id uuid references public.doctors(id) on delete cascade,
    patient_id uuid references public.profiles(id) on delete set null,
    patient_name text not null,
    rating integer not null check (rating between 1 and 5),
    comment text not null,
    is_approved boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. CONTACT MESSAGES TABLE
create table if not exists public.contact_messages (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text not null,
    phone text,
    subject text,
    message text not null,
    status text default 'unread' check (status in ('unread', 'read', 'responded')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRIGGER FOR NEW USER PROFILE CREATION
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Patient User'),
    new.email,
    new.raw_user_meta_data->>'phone',
    'patient' -- Force 'patient' role on public signup
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger firing on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
