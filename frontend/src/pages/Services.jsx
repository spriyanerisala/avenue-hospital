import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Activity,
  Microscope,
  Pill,
  Video,
  Bed,
  Ambulance,
  HeartHandshake,
  CheckCircle2,
  PhoneCall,
  Calendar
} from 'lucide-react';

import icuImg from '../assets/images/facilities/icu.jpg';
import otImg from '../assets/images/facilities/operation_theatre.jpg';
import roomImg from '../assets/images/facilities/patient_room.jpg';
import labImg from '../assets/images/facilities/laboratory.jpg';
import mriImg from '../assets/images/facilities/mri_scan.jpg';
import pharmaImg from '../assets/images/facilities/pharmacy.jpg';
import ambImg from '../assets/images/facilities/ambulance.jpg';
import bannerTelehealth from '../assets/images/banners/banner_telehealth.jpg';

export const Services = () => {
  const serviceCategories = [
    {
      title: '24/7 Level-1 Emergency & Trauma',
      desc: 'Immediate triage, rapid resuscitation suites, and zero-wait coronary angioplasty teams standing by 24/7.',
      img: ambImg,
      icon: ShieldAlert,
      features: ['Dedicated acute stroke protocol', 'Critical care ambulance fleet with mobile ventilators', 'Board-certified emergency intensivists']
    },
    {
      title: 'Robotic & Minimally Invasive Surgery',
      desc: 'Precision surgical procedures with reduced incisions, less post-operative discomfort, and faster discharge.',
      img: otImg,
      icon: Activity,
      features: ['Da Vinci Xi surgical robot', 'Laminar air-flow HEPA surgical suites', 'Robotic joint replacement and urology']
    },
    {
      title: 'Comprehensive Intensive Care (ICU)',
      desc: 'Multi-disciplinary intensive care units tailored for cardiac, neurological, surgical, and neonatal patients.',
      img: icuImg,
      icon: Bed,
      features: ['1:1 dedicated intensive care nursing', 'Advanced hemodynamic monitoring', 'Automated central telemetry']
    },
    {
      title: 'Advanced Diagnostics & 3T MRI Imaging',
      desc: 'Sub-millimeter diagnostic precision delivering crystal-clear scans and rapid automated pathology results.',
      img: mriImg,
      icon: Microscope,
      features: ['3.0 Tesla wide-bore silent MRI', '256-slice ultra-low-dose cardiac CT', 'Fully automated pathology turnaround']
    },
    {
      title: '24/7 In-House Hospital Pharmacy',
      desc: 'Fully accredited pharmacy dispensing verified genuine pharmaceuticals, specialty biologics, and medical devices.',
      img: pharmaImg,
      icon: Pill,
      features: ['Cold-chain biologics storage', 'Bedside medication delivery', 'Pharmacist dosage counseling']
    },
    {
      title: 'Global Tele-Health & Second Opinions',
      desc: 'Connect with senior Avenue Hospital specialists securely from home through HD encrypted video consultations.',
      img: bannerTelehealth,
      icon: Video,
      features: ['Multi-specialty case review', 'Digital prescription delivery', 'Direct lab order sync']
    }
  ];

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-cyan-400">
            Healthcare Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 dark:text-white mt-1">
            Comprehensive Clinical Care
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3">
            From 24/7 trauma response to complex robotic surgeries and outpatient specialty clinics, Avenue Hospital delivers complete end-to-end medical care under one roof.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {serviceCategories.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={srv.img}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-primary-600 dark:text-cyan-400 shadow">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white mb-2">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {srv.desc}
                    </p>

                    <div className="space-y-1.5">
                      {srv.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Link
                      to="/book"
                      className="text-xs font-semibold text-primary-600 dark:text-cyan-400 hover:text-primary-700 flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Service</span>
                    </Link>

                    <a
                      href="tel:+18004279911"
                      className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Inquire
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Assistance Banner */}
        <div className="bg-rose-600 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-heading font-bold">
              Require Emergency Medical Ambulance?
            </h3>
            <p className="text-xs sm:text-sm text-rose-100">
              Our GPS-tracked Advanced Cardiac Life Support (ACLS) ambulances are deployed within 3 minutes of emergency dispatch.
            </p>
          </div>
          <a
            href="tel:+18004279911"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-rose-600 font-bold text-sm shadow hover:bg-rose-50 transition transform hover:scale-105 shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 24/7 Hotline: +1 (800) 427-9911</span>
          </a>
        </div>
      </div>
    </div>
  );
};
