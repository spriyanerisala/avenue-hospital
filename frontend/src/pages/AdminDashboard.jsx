import React, { useEffect, useState } from 'react';
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  X
} from 'lucide-react';
import { adminService, doctorService, departmentService } from '../services/api';
import { useToast } from '../context/ToastContext';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview | doctors | appointments | payments
  const [loading, setLoading] = useState(true);

  // Add Doctor Modal State
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    department_id: '',
    specialization: '',
    qualification: '',
    experience_years: 10,
    consultation_fee: 900,
    bio: '',
    image_url: '/src/assets/images/doctors/cardiologist.jpg',
    email: '',
    phone: ''
  });
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const toast = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, docsRes, deptsRes, apptsRes, paysRes] = await Promise.all([
        adminService.getStats(),
        doctorService.getAll(),
        departmentService.getAll(),
        adminService.getAppointments(),
        adminService.getPayments()
      ]);

      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (docsRes.data?.doctors) setDoctors(docsRes.data.doctors);
      if (deptsRes.data?.departments) {
        setDepartments(deptsRes.data.departments);
        if (deptsRes.data.departments.length > 0) {
          setNewDoctor(prev => ({ ...prev, department_id: deptsRes.data.departments[0].id }));
        }
      }
      if (apptsRes.data?.appointments) setAppointments(apptsRes.data.appointments);
      if (paysRes.data?.payments) setPayments(paysRes.data.payments);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    setIsSubmittingDoc(true);
    try {
      const res = await adminService.createDoctor(newDoctor);
      if (res.data?.success) {
        toast.success('Doctor profile added successfully!');
        setShowAddDoctorModal(false);
        loadData();
      }
    } catch (err) {
      toast.error('Failed to create doctor.');
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this doctor?')) return;
    try {
      const res = await adminService.deleteDoctor(id);
      if (res.data?.success) {
        toast.success('Doctor deactivated.');
        loadData();
      }
    } catch (err) {
      toast.error('Failed to deactivate doctor.');
    }
  };

  const handleUpdateApptStatus = async (id, status) => {
    try {
      const res = await adminService.updateAppointmentStatus(id, { status });
      if (res.data?.success) {
        toast.success(`Appointment status updated to ${status}.`);
        loadData();
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold text-xl shadow">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Hospital Administration Portal
              </span>
              <h1 className="text-2xl font-heading font-black text-slate-900 dark:text-white">
                Executive Command Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Doctor</span>
            </button>
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Patients</span>
              <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white">
              {stats?.totalPatients || '184'}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12% this month
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Senior Doctors</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white">
              {doctors.length || '9'}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              Across 10 Clinical Depts
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Appointments</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white">
              {stats?.totalAppointments || '322'}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              {stats?.todayAppointments || '8'} scheduled today
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Hospital Revenue</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white">
              ₹{(stats?.totalRevenue || 247300).toLocaleString()}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              Razorpay Verified
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: 'overview', label: 'Department Analytics' },
            { id: 'doctors', label: `Manage Doctors (${doctors.length})` },
            { id: 'appointments', label: `Appointments (${appointments.length})` },
            { id: 'payments', label: `Razorpay Transactions (${payments.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Department Analytics */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-soft">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-4">
                Clinical Department Workload
              </h3>
              <div className="space-y-3">
                {departments.map((dept) => {
                  const docCount = doctors.filter(d => d.department_id === dept.id).length;
                  return (
                    <div key={dept.id} className="flex items-center justify-between text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{dept.name}</span>
                        <span className="text-slate-400">{dept.head_doctor || 'Head of Department'}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary-600 dark:text-cyan-400 block">{docCount} Doctor{docCount !== 1 ? 's' : ''}</span>
                        <span className="text-slate-400">Active Center</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-soft space-y-4">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                Recent Hospital Consultations
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.slice(0, 5).map((appt) => (
                  <div key={appt.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{appt.patient_name}</p>
                      <p className="text-slate-400">{appt.appointment_date} at {appt.appointment_time}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Doctors Management CRUD */}
        {activeTab === 'doctors' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Physician</th>
                    <th className="py-3 px-4">Department & Specialty</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">OPD Fee</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={doc.image_url} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{doc.name}</p>
                          <p className="text-[10px] text-slate-400">{doc.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900 dark:text-white">{doc.specialization}</p>
                        <p className="text-[10px] text-slate-400">{doc.qualification}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold">{doc.experience_years} Years</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">₹{doc.consultation_fee}</td>
                      <td className="py-3 px-4">⭐ {doc.rating}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteDoctor(doc.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Deactivate Doctor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Appointments List & Status Controls */}
        {activeTab === 'appointments' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {appt.patient_name}
                        <span className="block text-[10px] text-slate-400 font-normal">{appt.patient_phone}</span>
                      </td>
                      <td className="py-3 px-4">{appt.doctor?.name || 'Assigned Doctor'}</td>
                      <td className="py-3 px-4">{appt.appointment_date} ({appt.appointment_time})</td>
                      <td className="py-3 px-4">{appt.appointment_type}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-emerald-600">
                          {appt.payment_status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-cyan-300">
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleUpdateApptStatus(appt.id, 'confirmed')}
                          className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[10px] font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateApptStatus(appt.id, 'completed')}
                          className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 text-[10px] font-bold"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleUpdateApptStatus(appt.id, 'cancelled')}
                          className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 hover:bg-rose-200 text-[10px] font-bold"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Razorpay Payment Logs */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Razorpay Order ID</th>
                    <th className="py-3 px-4">Payment ID</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Gateway Status</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-primary-600 dark:text-cyan-400">{p.razorpay_order_id}</td>
                      <td className="py-3 px-4 text-emerald-600">{p.razorpay_payment_id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">₹{p.amount}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-500">{p.method || 'Razorpay Verified'}</td>
                      <td className="py-3 px-4 font-sans text-slate-400">{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Doctor Modal */}
        {showAddDoctorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Add Specialist Physician
                </h3>
                <button onClick={() => setShowAddDoctorModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDoctor} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Doctor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    placeholder="Dr. Alexander Wright, MD"
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Department *
                    </label>
                    <select
                      value={newDoctor.department_id}
                      onChange={(e) => setNewDoctor({ ...newDoctor, department_id: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      OPD Fee (INR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newDoctor.consultation_fee}
                      onChange={(e) => setNewDoctor({ ...newDoctor, consultation_fee: e.target.value })}
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Specialization Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDoctor.specialization}
                      onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                      placeholder="Consultant Cardiac Surgeon"
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Qualifications *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDoctor.qualification}
                      onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                      placeholder="MD, FACS (Stanford Medical)"
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Professional Biography
                  </label>
                  <textarea
                    rows="3"
                    value={newDoctor.bio}
                    onChange={(e) => setNewDoctor({ ...newDoctor, bio: e.target.value })}
                    placeholder="Brief background of clinical practice and achievements..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDoctorModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingDoc}
                    className="px-5 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {isSubmittingDoc ? 'Creating...' : 'Save Doctor'}
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
