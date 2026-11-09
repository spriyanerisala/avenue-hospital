import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Stethoscope,
  Activity,
  FileText,
  AlertCircle
} from 'lucide-react';
import { appointmentService, adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await appointmentService.getDoctorAppointments();
      if (res.data?.appointments) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      const res = await adminService.updateAppointmentStatus(apptId, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Appointment marked as ${newStatus}.`);
        fetchSchedule();
      }
    } catch (err) {
      toast.error('Failed to update appointment status.');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointment_date === todayStr);

  return (
    <div className="py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-primary-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Doctor Clinical Console
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
                {user?.full_name || 'Dr. Anthony F. Chen'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Senior Interventional Cardiologist • OPD Clinical Suite 402
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-slate-800 text-center border border-cyan-100 dark:border-slate-700">
              <span className="text-xs text-slate-500 block">Total Patients</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{appointments.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-primary-50 dark:bg-slate-800 text-center border border-primary-100 dark:border-slate-700">
              <span className="text-xs text-slate-500 block">Today's Visits</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-cyan-400">{todayAppointments.length}</span>
            </div>
          </div>
        </div>

        {/* Today's Consultations List */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600 dark:text-cyan-400" />
            <span>Today's Clinic Consultations</span>
          </h2>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Slot</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {appt.appointment_time}
                        <span className="block text-[10px] text-slate-400 font-normal">{appt.appointment_date}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {appt.patient_name}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Age: {appt.patient_age || 35} | {appt.patient_gender || 'Unspecified'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="block">{appt.patient_phone}</span>
                        <span className="text-[10px] text-slate-400">{appt.patient_email}</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate">
                        {appt.reason || 'Medical consultation'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-cyan-400 font-semibold text-[10px]">
                          {appt.appointment_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            appt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : appt.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        {appt.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-sm transition"
                          >
                            Complete
                          </button>
                        )}
                        {appt.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                            className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        No scheduled appointments found for today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
