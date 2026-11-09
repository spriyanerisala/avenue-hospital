import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  Heart,
  Share2,
  Globe
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-heading font-extrabold text-white tracking-tight flex items-center gap-1">
                  AVENUE <span className="text-cyan-400">HEALTH</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                  Multi-Specialty Hospital
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Delivering patient-centric healthcare with world-class medical specialists, state-of-the-art robotic surgical suites, and dedicated 24/7 critical trauma care.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>JCI Accredited</span>
              </div>
              <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-cyan-400">
                <Award className="w-4 h-4" />
                <span>NABH Certified</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#facebook" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary-600 hover:text-white flex items-center justify-center transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#twitter" aria-label="Twitter" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary-600 hover:text-white flex items-center justify-center transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#linkedin" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary-600 hover:text-white flex items-center justify-center transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#instagram" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary-600 hover:text-white flex items-center justify-center transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-primary-500" /> About Our Hospital
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-primary-500" /> Medical Specialists
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-primary-500" /> Clinical Departments
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-primary-500" /> Hospital Facilities
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-primary-500" /> Book Consultation
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-primary-500" /> Healthcare Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinical Departments */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm tracking-wider uppercase mb-4">
              Departments
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/departments" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" /> Cardiology & Heart
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" /> Neurology & Stroke
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" /> Orthopedics & Robotic Surgery
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" /> Pediatrics & Child Care
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" /> Dermatology & Laser
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" /> Emergency Trauma 24/7
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Emergency Desk */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm tracking-wider uppercase mb-4">
              Contact & Emergency
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  450 Avenue Medical Boulevard, Health District, NY 10021
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-semibold text-white">Emergency: +1 (800) 427-9911</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-400">care@avenuehospital.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-400">OPD: Mon - Sat: 8 AM - 8 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & medical disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Avenue Multi-Specialty Hospital. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with medical precision and compassionate care <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
