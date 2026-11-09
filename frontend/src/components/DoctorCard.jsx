import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Calendar, Clock, DollarSign } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageResolver';

export const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col group">
      {/* Doctor Image with Overlay Badge */}
      <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={resolveImageUrl(doctor.image_url, 'doctor')}
          alt={doctor.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/doctors/cardiologist.jpg';
          }}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-500 flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{doctor.rating}</span>
          <span className="text-slate-400 font-normal">({doctor.review_count})</span>
        </div>

        <div className="absolute bottom-3 left-3 bg-primary-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-cyan-300" />
          <span>{doctor.experience_years}+ Years Experience</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-cyan-400 mb-1">
            {doctor.specialization}
          </span>
          <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-cyan-400 transition-colors">
            {doctor.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {doctor.qualification}
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
            {doctor.bio}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="block text-[11px] text-slate-400 uppercase font-medium">Consultation Fee</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              ₹{doctor.consultation_fee}
            </span>
          </div>

          <Link
            to={`/book?doctor=${doctor.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm transition transform hover:-translate-y-0.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
