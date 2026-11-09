-- ==========================================================
-- AVENUE MULTI-SPECIALTY HOSPITAL - ROW LEVEL SECURITY (RLS)
-- ==========================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_availability enable row level security;
alter table public.appointments enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;

-- Helper function to check if current auth user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Helper function to check if current auth user is doctor
create or replace function public.is_doctor()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'doctor'
  );
end;
$$ language plpgsql security definer;

-- 1. PROFILES POLICIES
-- Anyone can view their own profile; Admins can view all profiles
create policy "Users can view their own profile" 
on public.profiles for select 
using (auth.uid() = id or public.is_admin());

-- Users can update their own profile (cannot change role directly)
create policy "Users can update their own profile" 
on public.profiles for update 
using (auth.uid() = id)
with check (
  auth.uid() = id 
  and role = (select role from public.profiles where id = auth.uid()) -- prevents self-escalation
);

-- Admins can update any profile (including roles)
create policy "Admins can update any profile" 
on public.profiles for update 
using (public.is_admin());

-- 2. DEPARTMENTS POLICIES
-- Anyone (even unauthenticated) can view active departments
create policy "Public can view active departments" 
on public.departments for select 
using (is_active = true or public.is_admin());

-- Only Admins can insert/update/delete departments
create policy "Admins can manage departments" 
on public.departments for all 
using (public.is_admin());

-- 3. DOCTORS POLICIES
-- Anyone can view active doctors
create policy "Public can view active doctors" 
on public.doctors for select 
using (is_active = true or public.is_admin());

-- Doctors can update their own profile details
create policy "Doctors can update their own record" 
on public.doctors for update 
using (profile_id = auth.uid() or public.is_admin());

-- Admins can manage all doctors
create policy "Admins can manage all doctors" 
on public.doctors for all 
using (public.is_admin());

-- 4. DOCTOR AVAILABILITY POLICIES
-- Anyone can view doctor availability for booking
create policy "Public can view doctor availability" 
on public.doctor_availability for select 
using (true);

-- Doctors can manage their own availability; Admins can manage all
create policy "Doctors and Admins can manage availability" 
on public.doctor_availability for all 
using (
  public.is_admin() or 
  exists (
    select 1 from public.doctors 
    where doctors.id = doctor_availability.doctor_id 
    and doctors.profile_id = auth.uid()
  )
);

-- 5. APPOINTMENTS POLICIES
-- Patients can view their own appointments
create policy "Patients can view their appointments" 
on public.appointments for select 
using (patient_id = auth.uid() or public.is_admin());

-- Doctors can view appointments booked with them
create policy "Doctors can view assigned appointments" 
on public.appointments for select 
using (
  exists (
    select 1 from public.doctors 
    where doctors.id = appointments.doctor_id 
    and doctors.profile_id = auth.uid()
  )
);

-- Anyone authenticated can insert an appointment
create policy "Authenticated users can book appointments" 
on public.appointments for insert 
with check (auth.uid() = patient_id or patient_id is null);

-- Patients can update/cancel their own appointments
create policy "Patients can cancel their own appointments" 
on public.appointments for update 
using (patient_id = auth.uid() or public.is_admin());

-- Doctors can update status of their appointments
create policy "Doctors can update assigned appointment status" 
on public.appointments for update 
using (
  exists (
    select 1 from public.doctors 
    where doctors.id = appointments.doctor_id 
    and doctors.profile_id = auth.uid()
  )
);

-- Admins can manage all appointments
create policy "Admins can manage all appointments" 
on public.appointments for all 
using (public.is_admin());

-- 6. PAYMENTS POLICIES
-- Patients can view their own payments via appointment link
create policy "Patients can view their payments" 
on public.payments for select 
using (
  exists (
    select 1 from public.appointments 
    where appointments.id = payments.appointment_id 
    and appointments.patient_id = auth.uid()
  ) or public.is_admin()
);

-- Service role / Admin can insert/update payments
create policy "Admins can manage all payments" 
on public.payments for all 
using (public.is_admin());

-- 7. REVIEWS POLICIES
-- Public can view approved reviews
create policy "Public can view approved reviews" 
on public.reviews for select 
using (is_approved = true or public.is_admin());

-- Patients can create reviews
create policy "Patients can write reviews" 
on public.reviews for insert 
with check (patient_id = auth.uid() or patient_id is null);

-- Admins can manage reviews
create policy "Admins can manage reviews" 
on public.reviews for all 
using (public.is_admin());

-- 8. CONTACT MESSAGES POLICIES
-- Anyone can submit a contact message
create policy "Anyone can insert contact message" 
on public.contact_messages for insert 
with check (true);

-- Only Admins can view and respond to contact messages
create policy "Admins can manage contact messages" 
on public.contact_messages for all 
using (public.is_admin());
