import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Home, ArrowLeft, PhoneCall } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
          <Activity className="w-9 h-9" />
        </div>

        <div>
          <span className="text-5xl sm:text-6xl font-heading font-black text-primary-600 dark:text-cyan-400 tracking-tight">
            404
          </span>
          <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mt-2">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            The clinical page or hospital resource you are searching for might have been relocated, rescheduled, or temporarily taken offline.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/contact"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <PhoneCall className="w-4 h-4 text-primary-500" />
            <span>Contact Helpdesk</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
