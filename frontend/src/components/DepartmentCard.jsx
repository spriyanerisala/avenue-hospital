import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const DepartmentCard = ({ department }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group">
      {/* Department Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={department.image_url}
          alt={department.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-3 left-4 right-4">
          <span className="text-white text-lg font-heading font-bold drop-shadow">
            {department.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-3">
            {department.description}
          </p>

          {department.services && department.services.length > 0 && (
            <div className="space-y-1 mb-4">
              {department.services.slice(0, 3).map((srv, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span className="truncate">{srv}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link
            to={`/departments?slug=${department.slug}`}
            className="text-xs font-semibold text-primary-600 dark:text-cyan-400 hover:text-primary-700 flex items-center gap-1 group/btn"
          >
            <span>Specialists & Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          <Link
            to={`/book?department=${department.id}`}
            className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-cyan-400"
          >
            Book OPD
          </Link>
        </div>
      </div>
    </div>
  );
};
