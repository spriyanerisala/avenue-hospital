import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  Building,
  Target,
  Compass,
  Heart,
  CheckCircle2,
  Calendar,
  Users,
  Clock,
  Sparkles
} from 'lucide-react';

import heroImg from '../assets/images/hospital/hero.jpg';
import receptionImg from '../assets/images/hospital/reception.jpg';
import teamImg from '../assets/images/hospital/team.jpg';
import consultationImg from '../assets/images/hospital/consultation.jpg';

export const About = () => {
  const milestones = [
    { year: '2008', title: 'Foundation of Avenue Health', desc: 'Established as an 80-bed cardiac and critical care facility with top university faculty.' },
    { year: '2014', title: 'JCI Global Accreditation', desc: 'Achieved Gold Seal of Approval from Joint Commission International for patient safety.' },
    { year: '2019', title: 'Robotic Surgery Institute', desc: 'Inaugurated state-of-the-art robotic surgical suites for joint replacement and urology.' },
    { year: '2024', title: 'Level-1 Comprehensive Trauma Wing', desc: 'Expanded to 350 multi-specialty beds with 24/7 cardiac catheterization and stroke triage.' },
  ];

  const values = [
    { title: 'Compassionate Care', desc: 'Treating each patient as family, with dignity, empathy, and transparent communication.', icon: Heart },
    { title: 'Clinical Rigor', desc: 'Practicing evidence-based medicine aligned with international healthcare safety benchmarks.', icon: ShieldCheck },
    { title: 'Technological Innovation', desc: 'Harnessing cutting-edge surgical robotics, AI diagnostics, and precision therapies.', icon: Sparkles },
    { title: 'Accessibility & Integrity', desc: 'Fair, transparent healthcare pricing with extensive cashless insurance coverage.', icon: Award },
  ];

  return (
    <div className="py-12 lg:py-16">
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-cyan-400">
            About Our Institution
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-slate-900 dark:text-white tracking-tight">
            World-Class Healing, <br className="hidden sm:inline" /> Compassionate Hearts
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Avenue Multi-Specialty Hospital stands as a beacon of clinical excellence and medical innovation, combining advanced healthcare technology with human empathy.
          </p>
        </div>
      </section>

      {/* 2. Hero Images Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 rounded-3xl overflow-hidden shadow-2xl h-96 relative">
            <img src={heroImg} alt="Avenue Hospital Facade" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-300">Modern Medical Campus</span>
              <h3 className="text-2xl font-bold font-heading">350-Bed Tertiary Care Hospital</h3>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-1 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-card h-44 relative">
              <img src={teamImg} alt="Medical Team" className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-4 text-white text-sm font-bold drop-shadow">
                120+ Distinguished Physicians
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-card h-44 relative">
              <img src={receptionImg} alt="Reception Lobby" className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-4 text-white text-sm font-bold drop-shadow">
                24/7 Patient Coordination Desk
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="bg-slate-50 dark:bg-slate-900/60 py-16 border-y border-slate-100 dark:border-slate-800 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-3">
                Our Mission
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                To provide patient-centered, high-precision healthcare by combining world-class clinical expertise, advanced surgical technologies, and uncompromising patient safety standards accessible to all members of our community.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-3">
                Our Vision
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                To be universally recognized as the region’s premier healthcare destination for complex clinical interventions, pioneering medical research, robotic surgery innovations, and empathetic patient outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-cyan-400">
            Our Culture
          </span>
          <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white mt-1">
            Our Core Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-2">
                  {v.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Hospital Milestones & Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-cyan-400">
            Our Journey
          </span>
          <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white mt-1">
            Milestones of Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((m, i) => (
            <div key={i} className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft">
              <span className="text-3xl font-heading font-black text-primary-600 dark:text-cyan-400">
                {m.year}
              </span>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base mt-2 mb-2">
                {m.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Medical Leadership CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-600 to-cyan-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-heading font-bold">
              Consult With Our Medical Leadership
            </h3>
            <p className="text-sm text-cyan-50 leading-relaxed">
              Experience the difference of specialized healthcare delivered by physicians who are leaders in their respective clinical disciplines.
            </p>
          </div>
          <Link
            to="/doctors"
            className="px-6 py-3.5 rounded-xl bg-white text-primary-700 hover:bg-slate-100 font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 shrink-0"
          >
            Meet Our Specialists
          </Link>
        </div>
      </section>
    </div>
  );
};
