import React from 'react';
import { PhoneCall, Clock, ShieldAlert, MessageSquare } from 'lucide-react';

export const EmergencyBar = () => {
  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs sm:text-sm py-2 px-4 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="font-semibold tracking-wide flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> 24/7 EMERGENCY & TRAUMA RESCUE
          </span>
          <span className="hidden md:inline text-red-100">| Level-1 Emergency & Cardiac Resuscitation Unit</span>
        </div>

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <a
            href="tel:+18004279911"
            className="flex items-center gap-1.5 font-bold bg-white text-red-600 px-3 py-1 rounded-full shadow hover:bg-red-50 transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 24/7: +1 (800) 427-9911</span>
          </a>

          <a
            href="https://wa.me/18004279911?text=Hello%2C%20I%20need%20assistance%20from%20Avenue%20Hospital"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 px-2.5 py-1 rounded-full transition font-medium"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
};
