import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Heart,
  Brain,
  Activity,
  Smile,
  Sparkles,
  Stethoscope,
  HeartHandshake,
  Award,
  Eye,
  ShieldAlert,
  Search,
  CheckCircle2,
  Calendar,
  Phone,
  ArrowRight
} from 'lucide-react';
import { departmentService, doctorService } from '../services/api';

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          departmentService.getAll(),
          doctorService.getAll()
        ]);
        const depts = deptRes.data?.departments || [];
        const docs = docRes.data?.doctors || [];

        setDepartments(depts);
        setDoctors(docs);

        const querySlug = searchParams.get('slug');
        if (querySlug) {
          const match = depts.find(d => d.slug === querySlug);
          if (match) setSelectedDept(match);
        } else if (depts.length > 0) {
          setSelectedDept(depts[0]);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const filteredDepts = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  const getDeptDoctors = (deptId) => {
    return doctors.filter(doc => doc.department_id === deptId && doc.is_active);
  };

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-cyan-400">
            Specialized Medicine
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 dark:text-white mt-1">
            Clinical Departments & Centers
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3">
            Explore our 10 specialized departments led by renowned medical professors, equipped with state-of-the-art diagnostic labs and surgical infrastructure.
          </p>

          {/* Search Box */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search departments or treatments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            />
          </div>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredDepts.map((dept) => {
            const deptDocs = getDeptDoctors(dept.id);
            return (
              <div
                key={dept.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group"
              >
                {/* Department Image with Title Overlay */}
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={dept.image_url}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-5 right-5">
                    <span className="text-xs uppercase font-semibold text-cyan-300 tracking-wider">
                      Department
                    </span>
                    <h3 className="text-xl font-heading font-bold text-white drop-shadow">
                      {dept.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {dept.description}
                  </p>

                  {/* Services List */}
                  {dept.services && (
                    <div className="space-y-1.5 pt-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Core Services
                      </p>
                      {dept.services.slice(0, 3).map((srv, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span className="truncate">{srv}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Available Specialists in Department */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Department Specialists ({deptDocs.length})
                    </p>
                    <div className="flex items-center gap-2">
                      {deptDocs.slice(0, 3).map((doc) => (
                        <img
                          key={doc.id}
                          src={doc.image_url}
                          alt={doc.name}
                          title={doc.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow"
                        />
                      ))}
                      {deptDocs.length > 0 && (
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {deptDocs[0]?.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      to={`/book?department=${dept.id}`}
                      className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs text-center shadow-sm transition"
                    >
                      Book OPD Visit
                    </Link>
                    <a
                      href={`tel:${dept.phone || '+18004278000'}`}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                      title="Direct Department Hotline"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
