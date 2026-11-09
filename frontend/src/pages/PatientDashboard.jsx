import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Edit3,
  CalendarPlus,
  RefreshCw,
  X
} from 'lucide-react';
import { appointmentService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const PatientDashboard = () => {
  const { user, setUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApptToReschedule, setSelectedApptToReschedule] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const toast = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await appointmentService.getMy();
      if (res.data?.appointments) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Error loading patient appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await appointmentService.cancel(id);
      if (res.data?.success) {
        toast.success('Appointment cancelled.');
        fetchAppointments();
      }
    } catch (err) {
      toast.error('Failed to cancel appointment.');
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime) {
      toast.error('Please choose a valid new date and time.');
      return;
    }
    setIsRescheduling(true);
    try {
      const res = await appointmentService.reschedule(selectedApptToReschedule.id, {
        new_date: newDate,
        new_time: newTime
      });
      if (res.data?.success) {
        toast.success('Appointment rescheduled successfully!');
        setSelectedApptToReschedule(null);
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reschedule failed. Slot may be occupied.');
    } finally {
      setIsRescheduling(false);
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-cyan-500 text-white flex items-center justify-center font-bold text-2xl uppercase shadow-md">
              {user?.full_name?.charAt(0) || 'P'}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-cyan-400">
                Patient Medical Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
                {user?.full_name || 'Patient User'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/book"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow transition transform hover:-translate-y-0.5"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book New OPD</span>
            </Link>

            <button
              onClick={fetchAppointments}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="Refresh Appointments"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft">
            <span className="text-xs font-semibold text-slate-400 block">Total Consultations</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
              {appointments.length}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft">
            <span className="text-xs font-semibold text-emerald-500 block">Active / Upcoming</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {upcomingAppointments.length}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft">
            <span className="text-xs font-semibold text-cyan-500 block">Completed Visits</span>
            <span className="text-2xl font-black text-cyan-600 mt-1 block">
              {appointments.filter(a => a.status === 'completed').length}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-soft">
            <span className="text-xs font-semibold text-slate-400 block">Total Paid Fees</span>
            <span className="text-2xl font-black text-primary-600 dark:text-cyan-400 mt-1 block">
              ₹{appointments.reduce((sum, a) => sum + (a.payment_status === 'paid' ? (Number(a.consultation_fee) || 800) : 0), 0)}
            </span>
          </div>
        </div>

        {/* Section: Upcoming Consultations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600 dark:text-cyan-400" />
              <span>Upcoming Scheduled Consultations</span>
            </h2>
            <span className="text-xs font-bold bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-cyan-300 px-2.5 py-1 rounded-full">
              {upcomingAppointments.length} Active
            </span>
          </div>

          {loading ? (
            <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col justify-between space-y-4 transition hover:border-primary-200 dark:hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={appt.doctor?.image_url || '/src/assets/images/doctors/cardiologist.jpg'}
                        alt={appt.doctor?.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                          {appt.doctor?.name || 'Specialist Physician'}
                        </h4>
                        <p className="text-xs text-primary-600 dark:text-cyan-400 font-medium">
                          {appt.doctor?.specialization || appt.departments?.name || 'Clinical Consultation'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block ${
                          appt.status === 'confirmed'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {appt.status}
                      </span>
                      <span className="block font-mono text-[10px] text-slate-400 mt-1">
                        #{String(appt.id).substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs py-3 border-y border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block font-medium">Visit Date</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {appt.appointment_date}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Time Slot</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {appt.appointment_time}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Mode</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {appt.appointment_type || 'In-Person OPD'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Consultation Fee</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        ₹{appt.consultation_fee || 800}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block font-medium">Payment Status</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {appt.payment_status === 'paid' ? 'Paid via Razorpay' : 'Pending Payment'}
                      </span>
                    </div>
                  </div>

                  {appt.reason && (
                    <div className="text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Reason / Symptoms</span>
                      <p className="text-slate-700 dark:text-slate-300 italic truncate mt-0.5">{appt.reason}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedApptToReschedule(appt);
                        setNewDate(appt.appointment_date);
                        setNewTime(appt.appointment_time);
                      }}
                      className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold text-rose-600 transition"
                    >
                      Cancel Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No active appointments scheduled.
              </p>
              <Link to="/book" className="text-xs text-primary-600 font-bold hover:underline mt-1 inline-block">
                Schedule your next health visit →
              </Link>
            </div>
          )}
        </div>

        {/* Section: Complete Booking History & Past Records */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" />
              <span>Complete Booking History & Consultation Records</span>
            </h2>
            <span className="text-xs text-slate-500">
              {appointments.length} total recorded
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Doctor / Specialist</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                    <th className="py-3 px-4">Fee Paid</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-semibold text-primary-600 dark:text-cyan-400">
                        #{String(appt.id).substring(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {appt.doctor?.name || 'Specialist Physician'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {appt.doctor?.specialization || 'Clinical Department'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{appt.appointment_date}</span>
                        <span className="block text-[11px] text-slate-400">{appt.appointment_time}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
                          {appt.appointment_type || 'In-Person'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-[180px] truncate text-slate-500">
                        {appt.reason || 'General clinical consultation'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        <p className="text-slate-900 dark:text-white">₹{appt.consultation_fee || 800}</p>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase">
                          {appt.payment_status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            appt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : appt.status === 'completed'
                              ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300'
                              : appt.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        No appointments found. Use the Book New OPD button to make your first booking!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Reschedule Modal */}
        {selectedApptToReschedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Reschedule Appointment
                </h3>
                <button
                  onClick={() => setSelectedApptToReschedule(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Rescheduling consultation with <strong>{selectedApptToReschedule.doctor?.name}</strong>.
              </p>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    New Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    New Time Slot
                  </label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApptToReschedule(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRescheduling}
                    className="px-5 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {isRescheduling ? 'Saving...' : 'Confirm Reschedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
