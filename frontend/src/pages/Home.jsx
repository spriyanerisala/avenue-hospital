import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  PhoneCall,
  ShieldCheck,
  Award,
  Users,
  Clock,
  Heart,
  Activity,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
  Building,
  Microscope,
  Stethoscope,
  ChevronRight,
  Star
} from 'lucide-react';
import { doctorService, departmentService } from '../services/api';
import { DoctorCard } from '../components/DoctorCard';
import { DepartmentCard } from '../components/DepartmentCard';

// Asset imports
import heroImg from '../assets/images/hospital/hero.jpg';
import teamImg from '../assets/images/hospital/team.jpg';
import consultationImg from '../assets/images/hospital/consultation.jpg';
import receptionImg from '../assets/images/hospital/reception.jpg';
import icuImg from '../assets/images/facilities/icu.jpg';
import otImg from '../assets/images/facilities/operation_theatre.jpg';
import roomImg from '../assets/images/facilities/patient_room.jpg';
import labImg from '../assets/images/facilities/laboratory.jpg';
import mriImg from '../assets/images/facilities/mri_scan.jpg';
import pharmaImg from '../assets/images/facilities/pharmacy.jpg';
import bannerCheckup from '../assets/images/banners/banner_checkup.jpg';

export const Home = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, deptRes] = await Promise.all([
          doctorService.getAll({ featured: 'true' }),
          departmentService.getAll()
        ]);
        if (docRes.data?.doctors) setFeaturedDoctors(docRes.data.doctors.slice(0, 4));
        if (deptRes.data?.departments) setDepartments(deptRes.data.departments.slice(0, 6));
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const facilities = [
    { name: 'Ultra-Modern Critical ICU', img: icuImg, desc: 'Advanced life-support monitors, continuous telemetry, and 1:1 dedicated intensive nursing.' },
    { name: 'Robotic Operation Theatres', img: otImg, desc: 'Next-generation laminar airflow suites with Da Vinci surgical robotic systems.' },
    { name: 'Luxury Inpatient Suites', img: roomImg, desc: 'Ergonomic recovery suites designed for patient comfort, tranquility, and healing.' },
    { name: 'Advanced Diagnostics & Lab', img: labImg, desc: 'Fully automated biochemistry, pathology, and rapid molecular turnaround testing.' },
    { name: '3T MRI & High-Slice CT', img: mriImg, desc: 'Sub-millimeter imaging precision with silent MRI technology and ultra-low radiation CT.' },
    { name: '24/7 In-House Pharmacy', img: pharmaImg, desc: 'Accredited pharmaceutical dispensing with cold-chain verified temperature control.' },
  ];

  const stats = [
    { value: '50,000+', label: 'Patients Treated', icon: Users },
    { value: '120+', label: 'Senior Specialists', icon: Stethoscope },
    { value: '25+', label: 'Clinical Departments', icon: Building },
    { value: '99.4%', label: 'Positive Outcomes', icon: Award },
  ];

  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Avenue Multi-Specialty Hospital Exterior"
            className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-950/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-white"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/20 border border-primary-400/30 text-cyan-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin-slow" />
                <span>Premier Multi-Specialty Healthcare Center</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.15]">
                Your Health, <br />
                <span className="bg-gradient-to-r from-cyan-400 via-primary-300 to-blue-200 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                Exceptional medical care, advanced robotic surgery, and compassionate healthcare professionals dedicated to your long-term well-being and speedy recovery.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/book"
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 hover:from-primary-600 hover:to-cyan-600 text-white font-semibold text-base shadow-lg shadow-primary-500/25 transition transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </Link>

                <Link
                  to="/doctors"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base backdrop-blur-md border border-white/20 transition"
                >
                  <span>Explore Doctors</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:+18004279911"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-semibold text-base transition shadow-lg shadow-rose-600/20"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>24/7 Emergency</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-300 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>JCI Accredited Hospital</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Under 10 Min Emergency Triage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>100% Cashless Insurance</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 space-y-4"
            >
              {/* Quick OPD Consultation Card */}
              <div className="glass p-6 rounded-2xl border border-white/10 shadow-2xl text-slate-800 dark:text-white space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-cyan-400">
                    Fast-Track Clinic
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    OPD Open Today
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold">
                  Schedule Your Medical Consultation
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-300">
                  Select your medical specialty and reserve an instant consultation with our board-certified physicians.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                      1
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-900 dark:text-white">Choose Specialty</p>
                      <p className="text-slate-400">Cardiology, Neurology, Ortho & more</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                      2
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-900 dark:text-white">Pick Available Slot</p>
                      <p className="text-slate-400">Real-time doctor calendar booking</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      3
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-900 dark:text-white">Instant Confirmation</p>
                      <p className="text-slate-400">Secure online payment & SMS token</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/book"
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow transition"
                >
                  <span>Start Booking Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="bg-white dark:bg-slate-900 py-10 border-b border-slate-100 dark:border-slate-800 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-900/60 flex items-center justify-center text-primary-600 dark:text-cyan-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white tracking-tight">
                      {item.value}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ABOUT THE HOSPITAL SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-[#0b1329]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Mosaic with AI Generated Photos */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-card h-56 bg-slate-200">
                  <img
                    src={consultationImg}
                    alt="Doctor Patient Consultation at Avenue Hospital"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card h-44 bg-slate-200">
                  <img
                    src={receptionImg}
                    alt="Avenue Hospital Reception Desk"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="rounded-2xl overflow-hidden shadow-card h-44 bg-slate-200">
                  <img
                    src={heroImg}
                    alt="Avenue Hospital Glass Architecture"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-card h-56 bg-slate-200">
                  <img
                    src={teamImg}
                    alt="Avenue Hospital Professional Medical Team"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Right Information */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-cyan-400">
                About Avenue Hospital
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white leading-tight">
                Pioneering Precision Medicine, Compassionate Care
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Founded with a mission to bring world-class healthcare to our community, Avenue Hospital has grown into a premier multi-specialty institution renowned for clinical excellence, advanced robotics, and empathetic care.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">Robotic Surgery</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sub-millimeter surgical accuracy with fast recovery</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">Emergency Level-1</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">24/7 dedicated acute stroke and cardiac response</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">Board-Certified Faculty</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Trained at Harvard, Johns Hopkins & Oxford</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">Holistic Healing</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Integrated patient wellness & physical therapy</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/about"
                  className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:opacity-90 transition"
                >
                  Discover Our Infrastructure
                </Link>
                <Link
                  to="/contact"
                  className="text-sm font-semibold text-primary-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Visit Campus</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEDICAL DEPARTMENTS SECTION */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-cyan-400">
                Specialized Care
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white mt-1">
                Centres of Clinical Excellence
              </h2>
            </div>
            <Link
              to="/departments"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-cyan-400 hover:text-primary-700 transition"
            >
              <span>View All 10 Departments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED DOCTORS SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-[#0b1329]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-cyan-400">
                Our Specialists
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white mt-1">
                Meet Our Senior Medical Consultants
              </h2>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-cyan-400 hover:text-primary-700 transition"
            >
              <span>Meet All Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOSPITAL FACILITIES SHOWCASE */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-cyan-400">
              Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white mt-1">
              World-Class Hospital Facilities
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              Every facility at Avenue Hospital is designed around patient safety, sterile protocols, and technological sophistication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((fac, idx) => (
              <div
                key={idx}
                className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-card transition duration-300"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={fac.img}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                  <h4 className="absolute bottom-3 left-4 right-4 text-white font-heading font-bold text-base drop-shadow">
                    {fac.name}
                  </h4>
                </div>
                <div className="p-5">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {fac.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PATIENT TESTIMONIALS */}
      <section className="py-20 bg-slate-50 dark:bg-[#0b1329]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-cyan-400">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white mt-1">
              Words From Our Patients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "Dr. Anthony Chen performed my cardiac angioplasty with exceptional skill. The Avenue cardiology team gave me back my health and vitality. The nursing care was truly remarkable."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 font-bold flex items-center justify-center text-xs">
                  MS
                </div>
                <div>
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white">Marcus Sterling</h6>
                  <p className="text-[10px] text-slate-400">Cardiology Patient</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "Dr. Sarah Jenkins is so thorough, gentle, and knowledgeable. Her stroke rehabilitation protocol worked wonders for my mother. She can now walk independently again."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 font-bold flex items-center justify-center text-xs">
                  EV
                </div>
                <div>
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white">Eleanor Vance</h6>
                  <p className="text-[10px] text-slate-400">Neurology Care</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "Robotic knee replacement with Dr. Vance was practically painless. The online booking and payment process was super seamless. Top hospital in the region."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  DK
                </div>
                <div>
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white">David Kirkland</h6>
                  <p className="text-[10px] text-slate-400">Orthopedic Surgery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. APPOINTMENT CTA BANNER */}
      <section className="relative py-16 bg-gradient-to-r from-primary-900 via-primary-800 to-cyan-900 text-white overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none">
          <img src={bannerCheckup} alt="Doctor with clipboard" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-300">
              Prompt Healthcare Access
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black">
              Need Medical Attention Today?
            </h2>
            <p className="text-sm text-primary-100 leading-relaxed">
              Book your OPD appointment in under 2 minutes, choose from our top specialists, and pay consultation fee securely online.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              to="/book"
              className="px-6 py-3.5 rounded-xl bg-white text-primary-900 hover:bg-primary-50 font-bold text-sm shadow-xl transition transform hover:scale-105"
            >
              Book Consultation Now
            </Link>
            <a
              href="tel:+18004279911"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 hover:bg-white/10 text-white font-semibold text-sm transition"
            >
              <PhoneCall className="w-4 h-4 text-cyan-300" />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
