-- ==========================================================
-- AVENUE MULTI-SPECIALTY HOSPITAL - SEED DATA
-- ==========================================================

-- 1. SEED DEPARTMENTS
insert into public.departments (id, name, slug, description, image_url, icon, head_doctor, phone) values
('d1000000-0000-0000-0000-000000000001', 'Cardiology', 'cardiology', 'Comprehensive cardiovascular care including interventional cardiology, heart failure management, and advanced cardiac diagnostics.', '/src/assets/images/departments/cardiology.jpg', 'Heart', 'Dr. Anthony Chen, MD, FACC', '+1 (800) 427-8001'),
('d1000000-0000-0000-0000-000000000002', 'Neurology', 'neurology', 'State-of-the-art diagnostic and surgical treatments for complex brain, spinal cord, and peripheral nervous system disorders.', '/src/assets/images/departments/neurology.jpg', 'Brain', 'Dr. Sarah Jenkins, MD, FAAN', '+1 (800) 427-8002'),
('d1000000-0000-0000-0000-000000000003', 'Orthopedics', 'orthopedics', 'Advanced joint replacements, sports injury rehabilitation, spine surgeries, and trauma reconstruction.', '/src/assets/images/departments/orthopedics.jpg', 'Bone', 'Dr. Michael Vance, MD', '+1 (800) 427-8003'),
('d1000000-0000-0000-0000-000000000004', 'Pediatrics', 'pediatrics', 'Compassionate pediatric healthcare covering newborn care, developmental assessments, immunizations, and pediatric emergencies.', '/src/assets/images/departments/pediatrics.jpg', 'Baby', 'Dr. Emily Rodriguez, MD, FAAP', '+1 (800) 427-8004'),
('d1000000-0000-0000-0000-000000000005', 'Dermatology', 'dermatology', 'Expert clinical and cosmetic dermatology treating skin disorders, laser therapies, and skin cancer screenings.', '/src/assets/images/departments/dermatology.jpg', 'Sparkles', 'Dr. Priya Sharma, MD', '+1 (800) 427-8005'),
('d1000000-0000-0000-0000-000000000006', 'General Medicine', 'general-medicine', 'Primary care and internal medicine focusing on preventive health, chronic illness management, and geriatric care.', '/src/assets/images/departments/general_medicine.jpg', 'Stethoscope', 'Dr. David Miller, MD', '+1 (800) 427-8006'),
('d1000000-0000-0000-0000-000000000007', 'Gynecology & Obstetrics', 'gynecology', 'Comprehensive women''s health services, prenatal care, high-risk obstetrics, and minimally invasive gynecological surgery.', '/src/assets/images/departments/gynecology.jpg', 'UserCheck', 'Dr. Amanda Lee, MD, FACOG', '+1 (800) 427-8007'),
('d1000000-0000-0000-0000-000000000008', 'Dentistry', 'dentistry', 'Full-spectrum oral healthcare including dental implants, orthodontics, cosmetic smile makeovers, and periodontal care.', '/src/assets/images/departments/dentistry.jpg', 'Smile', 'Dr. James Wilson, DDS', '+1 (800) 427-8008'),
('d1000000-0000-0000-0000-000000000009', 'Ophthalmology', 'ophthalmology', 'Advanced eye care encompassing cataract laser surgery, retinal therapies, glaucoma management, and pediatric vision care.', '/src/assets/images/departments/ophthalmology.jpg', 'Eye', 'Dr. Elena Rostova, MD', '+1 (800) 427-8009'),
('d1000000-0000-0000-0000-000000000010', 'Emergency & Trauma Care', 'emergency-care', '24/7 Level-1 trauma and emergency resuscitation center staffed by board-certified emergency physicians.', '/src/assets/images/departments/emergency.jpg', 'Ambulance', 'Dr. Marcus Vance, MD, FACEP', '+1 (800) 427-9911')
on conflict (id) do nothing;

-- 2. SEED DOCTORS
insert into public.doctors (id, department_id, name, email, phone, specialization, qualification, experience_years, consultation_fee, bio, image_url, rating, review_count, is_featured, is_active) values
('c1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Dr. Anthony F. Chen', 'anthony.chen@avenuehospital.com', '+1 (800) 427-101', 'Senior Interventional Cardiologist', 'MD, FACC, FSCAI (Harvard Medical School)', 18, 1200.00, 'Specializes in complex coronary angioplasty, transcatheter aortic valve replacement (TAVR), and heart failure therapies with over 4,000 successful procedures.', '/src/assets/images/doctors/cardiologist.jpg', 4.95, 142, true, true),

('c1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'Dr. Sarah Jenkins', 'sarah.jenkins@avenuehospital.com', '+1 (800) 427-102', 'Chief Neurologist & Stroke Specialist', 'MD, FAAN (Johns Hopkins University)', 15, 1100.00, 'Expert in acute stroke management, epilepsy monitoring, multiple sclerosis, and neurodegenerative disorder therapies.', '/src/assets/images/doctors/neurologist.jpg', 4.92, 118, true, true),

('c1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003', 'Dr. Michael Vance', 'michael.vance@avenuehospital.com', '+1 (800) 427-103', 'Senior Orthopedic & Joint Surgeon', 'MS (Orthopedics), MCh (Stanford Medical)', 16, 1000.00, 'Pioneer in robotic-assisted knee and hip replacement surgery, arthroscopic reconstruction, and sports traumatology.', '/src/assets/images/doctors/orthopedic.jpg', 4.88, 96, true, true),

('c1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000004', 'Dr. Emily Rodriguez', 'emily.rodriguez@avenuehospital.com', '+1 (800) 427-104', 'Lead Pediatric Specialist', 'MD, FAAP (Columbia University)', 12, 800.00, 'Dedicated to compassionate pediatric wellness, childhood developmental care, pediatric allergies, and neonatal support.', '/src/assets/images/doctors/pediatrician.jpg', 4.96, 164, true, true),

('c1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000005', 'Dr. Priya Sharma', 'priya.sharma@avenuehospital.com', '+1 (800) 427-105', 'Consultant Dermatologist & Aesthetic Surgeon', 'MD (Dermatology), DNB (Oxford Fellow)', 11, 900.00, 'Recognized for advanced clinical dermatology, laser resurfacing, chronic skin condition management, and dermatopathology.', '/src/assets/images/doctors/dermatologist.jpg', 4.89, 87, false, true),

('c1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000006', 'Dr. David Miller', 'david.miller@avenuehospital.com', '+1 (800) 427-106', 'Senior Internal Medicine Physician', 'MD (Internal Medicine), FACP', 20, 750.00, 'Expert in adult diagnostic medicine, metabolic syndrome management, lifestyle medicine, and multi-system illness coordination.', '/src/assets/images/doctors/general_physician.jpg', 4.91, 130, true, true),

('c1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000007', 'Dr. Amanda Lee', 'amanda.lee@avenuehospital.com', '+1 (800) 427-107', 'Senior Obstetrician & Gynecologist', 'MD, FACOG (UCSF Medical School)', 14, 950.00, 'Specialist in maternal-fetal medicine, high-risk pregnancy care, robotic laparoscopic surgeries, and reproductive endocrinology.', '/src/assets/images/doctors/gynecologist.jpg', 4.94, 112, false, true),

('c1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000008', 'Dr. James Wilson', 'james.wilson@avenuehospital.com', '+1 (800) 427-108', 'Consultant Maxillofacial & Dental Surgeon', 'DDS, MS (University of Pennsylvania)', 13, 700.00, 'Expert in computer-guided dental implants, cosmetic restorative dentistry, TMJ disorder treatment, and full-mouth rehabilitation.', '/src/assets/images/doctors/dentist.jpg', 4.87, 79, false, true),

('c1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000009', 'Dr. Elena Rostova', 'elena.rostova@avenuehospital.com', '+1 (800) 427-109', 'Senior Vitreoretinal & Cataract Surgeon', 'MD (Ophthalmology), FEBO', 17, 1050.00, 'Specializes in sutureless micro-incision cataract surgery (MICS), diabetic retinopathy treatments, and laser vision correction.', '/src/assets/images/doctors/ophthalmologist.jpg', 4.93, 98, false, true)
on conflict (id) do nothing;

-- 3. SEED DOCTOR AVAILABILITY (Mon - Sat for each doctor)
insert into public.doctor_availability (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes)
select d.id, dow.d, '09:00:00'::time, '17:00:00'::time, 30
from public.doctors d
cross join (values (1), (2), (3), (4), (5), (6)) as dow(d)
on conflict do nothing;

-- 4. SEED REVIEWS
insert into public.reviews (doctor_id, patient_name, rating, comment) values
('c1000000-0000-0000-0000-000000000001', 'Marcus Sterling', 5, 'Dr. Anthony Chen performed my angioplasty with exceptional skill. The Avenue hospital cardiology team gave me back my health.'),
('c1000000-0000-0000-0000-000000000002', 'Eleanor Vance', 5, 'Dr. Sarah Jenkins is so thorough, gentle, and knowledgeable. Her stroke rehabilitation plan worked wonders for my mother.'),
('c1000000-0000-0000-0000-000000000003', 'David K.', 5, 'Robotic knee replacement with Dr. Vance was practically painless. I was walking independently within two weeks!'),
('c1000000-0000-0000-0000-000000000004', 'Clara Miller', 5, 'Dr. Emily is truly the best pediatrician. Our kids actually look forward to clinic visits. Wonderful bedside manner.')
on conflict do nothing;
