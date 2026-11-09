import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Mail, Lock, LogIn, ArrowRight, ShieldCheck, Stethoscope, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('patient@demo.com');
  const [password, setPassword] = useState('demo123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      setIsSubmitting(false);
      if (res && res.success) {
        if (res.user?.role === 'admin') navigate('/dashboard/admin');
        else if (res.user?.role === 'doctor') navigate('/dashboard/doctor');
        else navigate('/dashboard/patient');
      }
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (role) => {
    let demoEmail = 'patient@demo.com';
    if (role === 'doctor') demoEmail = 'anthony.chen@avenuehospital.com';
    if (role === 'admin') demoEmail = 'admin@avenuehospital.com';

    setEmail(demoEmail);
    setPassword('demo123');

    const user = await demoLogin(role);
    if (user.role === 'admin') navigate('/dashboard/admin');
    else if (user.role === 'doctor') navigate('/dashboard/doctor');
    else navigate('/dashboard/patient');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-soft">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-cyan-500 flex items-center justify-center text-white shadow mx-auto mb-3">
            <Activity className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-heading font-black text-slate-900 dark:text-white">
            Sign In to Avenue Health
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access appointments, medical histories & patient records
          </p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="p-4 rounded-2xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/60 text-center space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-cyan-400">
            ⚡ Instant 1-Click Role Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('patient')}
              className="py-2 px-2 rounded-xl bg-white dark:bg-slate-800 border border-primary-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-primary-500 hover:text-primary-600 transition flex flex-col items-center gap-1 shadow-sm"
            >
              <User className="w-4 h-4 text-primary-500" />
              <span>Patient</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('doctor')}
              className="py-2 px-2 rounded-xl bg-white dark:bg-slate-800 border border-primary-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-600 transition flex flex-col items-center gap-1 shadow-sm"
            >
              <Stethoscope className="w-4 h-4 text-cyan-500" />
              <span>Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-2 rounded-xl bg-white dark:bg-slate-800 border border-primary-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-rose-500 hover:text-rose-600 transition flex flex-col items-center gap-1 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Password
              </label>
              <span className="text-[11px] text-slate-400">
                Demo password pre-filled
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow transition disabled:opacity-50 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Register Footer */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          Don't have a patient account?{' '}
          <Link to="/register" className="font-bold text-primary-600 dark:text-cyan-400 hover:underline">
            Register as Patient
          </Link>
        </div>
      </div>
    </div>
  );
};
