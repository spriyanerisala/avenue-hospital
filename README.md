# Avenue Health - Premium Full-Stack Multi-Specialty Hospital Web Platform

A production-ready, realistic, premium healthcare web application featuring modern UI/UX, AI-generated medical photography, appointment booking engine, server-verified Razorpay payment integration, Supabase authentication & Row Level Security (RLS), and dedicated role-based portals for Patients, Doctors, and Hospital Administrators.

---

## 🌟 Key Features

### 🏥 Modern Healthcare UI / UX
- **Theme & Design**: Medical blue (`#0c8ce9`), cyan accents, dark/light theme switching, and glassmorphism elements.
- **AI Medical Assets**: Local high-resolution photography assets organized by doctors, departments, hospital exterior/lobby, and clinical facilities (`frontend/src/assets/images/`).
- **Sticky Navigation**: Floating 24/7 trauma emergency hotline, WhatsApp desk, mobile responsive drawer, and quick booking CTA.
- **Smooth Animations**: Framer Motion transitions, responsive cards, toast notifications, and celebratory booking confetti.

### 📅 Advanced Appointment Booking Workflow
1. Select Clinical Department (Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, etc.)
2. Select Specialist Physician with portrait, qualifications, and consultation fee
3. Pick Appointment Date (with past date protection)
4. Choose Consultation Mode (In-Person OPD or Encrypted Tele-Health)
5. Select Real-time Available Time Slots (prevents duplicate bookings and disables reserved slots)
6. Enter Patient Information & Clinical Reason
7. Review Breakdown & Hospital Triage Summary
8. Secure Razorpay Checkout (Test Mode)
9. Server-side Cryptographic Payment Verification (HMAC SHA256)
10. Appointment Confirmation Slip & Token Generation

### 🔐 Authentication & Role-Based Access Control
- Powered by Supabase Auth with server-side role validation.
- Roles: `patient`, `doctor`, `admin`.
- Prevents public users from self-elevating to Doctor or Admin.
- **1-Click Demo Logins** on the login page for instant portfolio evaluation:
  - 👤 **Patient**: `patient@demo.com`
  - 🩺 **Doctor**: `anthony.chen@avenuehospital.com`
  - 🛡️ **Admin**: `admin@avenuehospital.com`

### 📊 Three Role-Dedicated Portals
1. **Patient Dashboard** (`/dashboard/patient`):
   - Upcoming scheduled visits
   - Reschedule consultation modal
   - Cancel appointment
   - Past consultation history & fee receipts
2. **Doctor Clinical Console** (`/dashboard/doctor`):
   - Today's appointment queue
   - Patient contact details & medical notes
   - Update visit status (Complete, Cancel)
3. **Admin Command Center** (`/dashboard/admin`):
   - Real-time hospital metrics (Total patients, active doctors, appointments today, revenue)
   - Clinical department workload analytics
   - Doctor Management CRUD (Add specialist modal, deactivate doctor)
   - Appointment status controls
   - Razorpay transaction ledger

---

## 🏗️ Project Architecture

```
hospital-web/
├── frontend/                     # React 19 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── assets/images/        # Organized medical photography assets
│   │   │   ├── banners/          # Emergency, checkup, telehealth banners
│   │   │   ├── departments/      # Cardiology, Neurology, Orthopedics, etc.
│   │   │   ├── doctors/          # High-resolution physician portraits
│   │   │   ├── facilities/       # ICU, OT, 3T MRI, Labs, Ambulance
│   │   │   └── hospital/         # Exterior facade, lobby, consultation
│   │   ├── components/           # Navbar, Footer, EmergencyBar, DoctorCard, DepartmentCard, etc.
│   │   ├── context/              # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/                # Home, About, Departments, Doctors, BookAppointment, Services, Contact, Blog, Login, Register, Dashboards
│   │   └── services/             # Axios API client & Supabase connector
│   ├── index.html                # Razorpay checkout script & typography
│   └── tailwind.config.js
│
├── backend/                      # Node.js + Express.js API
│   ├── src/
│   │   ├── config/               # Supabase & Razorpay SDK configuration
│   │   ├── controllers/          # Auth, Doctors, Departments, Appointments, Payments, Admin, Contact
│   │   ├── middleware/           # JWT & role verification, rate limiting, security
│   │   ├── routes/               # Modular REST API endpoints
│   │   └── utils/                # In-memory persistent data store fallback
│   ├── server.js                 # Express server with Helmet & CORS
│   └── package.json
│
└── supabase/
    ├── schema.sql                # Complete relational database DDL & triggers
    ├── policies.sql              # Supabase Row Level Security (RLS) policies
    └── seed.sql                  # Seed data for 10 departments and specialists
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm start
```
The backend API will start on `http://localhost:5000`.
Health check: `http://localhost:5000/api/health`

### 2. Start the Frontend Application
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key
RAZORPAY_KEY_ID=rzp_test_hospital_sample_key
RAZORPAY_KEY_SECRET=sample_secret_key_hospital_123
RAZORPAY_WEBHOOK_SECRET=sample_webhook_secret_123
FRONTEND_URL=http://localhost:5173
JWT_SECRET=avenue_hospital_secure_jwt_secret_2026
```

### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=rzp_test_hospital_sample_key
VITE_API_URL=http://localhost:5000/api
```

> **Note on Zero-Config Offline Mode:**
> If live Supabase or Razorpay credentials are not yet configured, the system seamlessly uses its built-in in-memory healthcare engine with all 10 departments, 9 specialist doctors, conflict-checking slot booking, and Razorpay test mode payment verification. You can plug in live credentials at any time without code changes.

---

## 🗄️ Setting Up Live Supabase Database

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Run `supabase/schema.sql` to initialize tables and triggers.
4. Run `supabase/policies.sql` to enable Row Level Security.
5. Run `supabase/seed.sql` to load departments, doctors, and reviews.
6. Copy your project URL and keys into `backend/.env` and `frontend/.env`.

---

## 💳 Razorpay Test Mode Workflow

1. Get your Test API Key from [Razorpay Dashboard](https://dashboard.razorpay.com/#/app/keys).
2. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
3. Patients book appointments and checkout using Razorpay Test Cards / UPI / NetBanking.
4. Server calculates HMAC SHA256 signature to verify authenticity before confirming appointment.
