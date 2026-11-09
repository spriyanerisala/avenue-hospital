import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Building,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Download,
  Phone,
  Mail,
  Video,
  Hospital
} from 'lucide-react';
import { departmentService, doctorService, appointmentService, paymentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resolveImageUrl } from '../utils/imageResolver';

export const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  // Wizard state: 1: Selection, 2: Patient Info, 3: Review & Pay, 4: Confirmation
  const [step, setStep] = useState(1);

  // Standard default slots
  const DEFAULT_CLINICAL_SLOTS = [
    { time: '09:00 AM', isAvailable: true },
    { time: '09:30 AM', isAvailable: true },
    { time: '10:00 AM', isAvailable: true },
    { time: '10:30 AM', isAvailable: true },
    { time: '11:00 AM', isAvailable: true },
    { time: '11:30 AM', isAvailable: true },
    { time: '02:00 PM', isAvailable: true },
    { time: '02:30 PM', isAvailable: true },
    { time: '03:00 PM', isAvailable: true },
    { time: '03:30 PM', isAvailable: true },
    { time: '04:00 PM', isAvailable: true },
    { time: '04:30 PM', isAvailable: true },
  ];

  // Data lists
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState(DEFAULT_CLINICAL_SLOTS);

  // Form selections
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [appointmentType, setAppointmentType] = useState('In-Person');

  // Patient Info
  const [patientName, setPatientName] = useState(user?.full_name || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState('Male');
  const [medicalReason, setMedicalReason] = useState('');

  // Processing state
  const [loading, setLoading] = useState(true);
  const [isSlotLoading, setIsSlotLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Sync patient info when user logs in
  useEffect(() => {
    if (user) {
      if (user.full_name) setPatientName(user.full_name);
      if (user.email) setPatientEmail(user.email);
      if (user.phone) setPatientPhone(user.phone);
    }
  }, [user]);

  // Load initial departments and doctors
  useEffect(() => {
    const init = async () => {
      try {
        const [deptsRes, docsRes] = await Promise.all([
          departmentService.getAll(),
          doctorService.getAll()
        ]);
        const depts = deptsRes.data?.departments || [];
        const docs = docsRes.data?.doctors || [];
        setDepartments(depts);
        setDoctors(docs);

        const deptQuery = searchParams.get('department');
        const docQuery = searchParams.get('doctor');

        if (docQuery) {
          setSelectedDoctorId(docQuery);
          const matchedDoc = docs.find(d => d.id === docQuery);
          if (matchedDoc) {
            setSelectedDeptId(matchedDoc.department_id);
          }
        } else if (deptQuery) {
          setSelectedDeptId(deptQuery);
          const firstDocInDept = docs.find(d => d.department_id === deptQuery);
          if (firstDocInDept) setSelectedDoctorId(firstDocInDept.id);
        } else if (depts.length > 0) {
          setSelectedDeptId(depts[0].id);
          const firstDoc = docs.find(d => d.department_id === depts[0].id);
          if (firstDoc) setSelectedDoctorId(firstDoc.id);
        }
      } catch (err) {
        console.error('Error initializing booking:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [searchParams]);

  // Load available doctor slots when doctor or date changes
  useEffect(() => {
    if (!selectedDoctorId || !appointmentDate) return;

    const fetchSlots = async () => {
      setIsSlotLoading(true);
      try {
        const res = await doctorService.getAvailability(selectedDoctorId, appointmentDate);
        if (res.data?.slots && res.data.slots.length > 0) {
          setAvailableSlots(res.data.slots);
          const firstAvail = res.data.slots.find(s => s.isAvailable);
          if (firstAvail && !selectedTimeSlot) {
            setSelectedTimeSlot(firstAvail.time);
          }
        } else {
          setAvailableSlots(DEFAULT_CLINICAL_SLOTS);
        }
      } catch (err) {
        console.warn('Using default clinical slots:', err.message);
        setAvailableSlots(DEFAULT_CLINICAL_SLOTS);
      } finally {
        setIsSlotLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDoctorId, appointmentDate]);

  // Doctors in selected department
  const filteredDoctors = doctors.filter(
    d => !selectedDeptId || d.department_id === selectedDeptId
  );

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);
  const selectedDept = departments.find(d => d.id === selectedDeptId);

  // Step 1 Validation
  const handleProceedToDetails = () => {
    if (!selectedDoctorId) {
      toast.error('Please select a doctor.');
      return;
    }
    if (!appointmentDate) {
      toast.error('Please choose an appointment date.');
      return;
    }
    if (!selectedTimeSlot) {
      toast.error('Please select an available time slot.');
      return;
    }
    setStep(2);
  };

  // Step 2 Validation
  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.error('Patient name is required.');
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      toast.error('Valid patient email is required.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.length < 8) {
      toast.error('Valid contact phone number is required.');
      return;
    }
    setStep(3);
  };

  // Step 3 Payment & Server Verification
  const handleRazorpayPayment = async () => {
    setIsPaying(true);
    try {
      // 1. Create appointment record on backend
      const apptRes = await appointmentService.create({
        doctor_id: selectedDoctorId,
        department_id: selectedDeptId,
        appointment_date: appointmentDate,
        appointment_time: selectedTimeSlot,
        appointment_type: appointmentType,
        reason: medicalReason || 'General clinical consultation',
        patient_name: patientName,
        patient_email: patientEmail,
        patient_phone: patientPhone,
        patient_age: patientAge,
        patient_gender: patientGender,
      });

      if (!apptRes.data?.success) {
        throw new Error(apptRes.data?.message || 'Failed to initiate appointment.');
      }

      const appointment = apptRes.data.appointment;

      // 2. Create Razorpay order on backend
      const orderRes = await paymentService.createOrder(appointment.id);
      if (!orderRes.data?.success) {
        throw new Error(orderRes.data?.message || 'Failed to generate payment order.');
      }

      const { orderId, amount, currency, keyId } = orderRes.data;

      // 3. Configure Razorpay checkout options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency || 'INR',
        name: 'Avenue Multi-Specialty Hospital',
        description: `Consultation with ${selectedDoctor?.name || 'Specialist'}`,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&q=80',
        order_id: orderId,
        prefill: {
          name: patientName,
          email: patientEmail,
          contact: patientPhone,
        },
        theme: {
          color: '#0c8ce9',
        },
        handler: async function (response) {
          // 4. Server-Side Payment Signature Verification
          try {
            const verifyRes = await paymentService.verifyPayment({
              appointment_id: appointment.id,
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || 'sandbox_verified',
            });

            if (verifyRes.data?.success) {
              setConfirmedBooking({
                ...verifyRes.data.appointment,
                doctor: selectedDoctor,
                department: selectedDept,
                paymentId: response.razorpay_payment_id || `pay_verified_${Date.now()}`,
              });
              setStep(4);
              toast.success('Payment verified & appointment confirmed!');
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
            } else {
              toast.error(verifyRes.data?.message || 'Payment signature verification failed.');
            }
          } catch (err) {
            toast.error('Payment verification failed on server.');
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
            toast.warning('Payment window closed. Your appointment is pending payment.');
          },
        },
      };

      // Check if real Razorpay script is present, otherwise simulate instant test completion
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          toast.error(`Payment failed: ${response.error.description}`);
          setIsPaying(false);
        });
        rzp.open();
      } else {
        // Fallback simulation for sandbox environments
        setTimeout(async () => {
          await options.handler({
            razorpay_order_id: orderId,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: 'sandbox_test_signature',
          });
        }, 1200);
      }
    } catch (error) {
      console.error('Booking error:', error);
      const msg = error.response?.data?.message || error.message || 'Booking process encountered an error.';
      toast.error(msg);
      setIsPaying(false);
    }
  };

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wizard Header Progress Indicator */}
        <div className="mb-10">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-cyan-400">
              Online Appointment Booking
            </span>
            <h1 className="text-3xl font-heading font-black text-slate-900 dark:text-white mt-1">
              Book Medical Consultation
            </h1>
          </div>

          {/* Steps Breadcrumb */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Doctor & Slot' },
              { num: 2, label: 'Patient Info' },
              { num: 3, label: 'Review & Pay' },
              { num: 4, label: 'Confirmation' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition ${
                  step === s.num
                    ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-cyan-400 font-bold'
                    : step > s.num
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1 ${
                    step === s.num
                      ? 'bg-primary-600 text-white shadow'
                      : step > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-[11px] sm:text-xs truncate">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: DOCTOR, DATE & SLOT SELECTION */}
        {step === 1 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-soft space-y-8">
            {/* 1. Department Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Clinical Department
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => {
                      setSelectedDeptId(dept.id);
                      const firstDoc = doctors.find(d => d.department_id === dept.id);
                      if (firstDoc) setSelectedDoctorId(firstDoc.id);
                    }}
                    className={`p-3 rounded-2xl text-left border text-xs font-semibold transition ${
                      selectedDeptId === dept.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-cyan-400 ring-2 ring-primary-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="truncate">{dept.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Doctor Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                2. Select Specialist Physician
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`cursor-pointer p-3 rounded-2xl border flex items-center gap-3 transition ${
                      selectedDoctorId === doc.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 ring-2 ring-primary-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={resolveImageUrl(doc.image_url, 'doctor')}
                      alt={doc.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/doctors/cardiologist.jpg';
                      }}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-primary-600 dark:text-cyan-400 truncate font-medium">
                        {doc.specialization}
                      </p>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        Fee: ₹{doc.consultation_fee}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Appointment Date & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  3. Select Appointment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  4. Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAppointmentType('In-Person')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                      appointmentType === 'In-Person'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-cyan-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <Hospital className="w-4 h-4" />
                    <span>In-Person OPD</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppointmentType('Online Consultation')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                      appointmentType === 'Online Consultation'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-cyan-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Tele-Health</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Time Slot Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  5. Available Doctor Slots
                </label>
                <span className="text-[11px] text-slate-400">
                  {isSlotLoading ? 'Updating slots...' : '30-minute intervals'}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(availableSlots.length > 0 ? availableSlots : DEFAULT_CLINICAL_SLOTS).map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedTimeSlot(slot.time)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      !slot.isAvailable
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-50 line-through'
                        : selectedTimeSlot === slot.time
                        ? 'border-primary-500 bg-primary-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-primary-400 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleProceedToDetails}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow transition"
              >
                <span>Continue to Patient Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PATIENT INFORMATION */}
        {step === 2 && (
          <form onSubmit={handleProceedToReview} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-soft space-y-6">
            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Patient Identification & Clinical Notes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Email Address (For Confirmation Token) *
                </label>
                <input
                  type="email"
                  required
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="115"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Reason for Visit / Primary Symptoms
              </label>
              <textarea
                rows="3"
                value={medicalReason}
                onChange={(e) => setMedicalReason(e.target.value)}
                placeholder="Briefly describe your symptoms or reason for consulting the specialist..."
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow transition"
              >
                <span>Review & Pay</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: REVIEW & RAZORPAY CHECKOUT */}
        {step === 3 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-soft space-y-6">
            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Review Appointment Summary & Pay
            </h3>

            {/* Doctor & Appointment Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center gap-4">
              <img
                src={resolveImageUrl(selectedDoctor?.image_url, 'doctor')}
                alt={selectedDoctor?.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/doctors/cardiologist.jpg';
                }}
                className="w-20 h-20 rounded-2xl object-cover shrink-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs font-bold uppercase text-primary-600 dark:text-cyan-400">
                  {selectedDept?.name}
                </span>
                <h4 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                  {selectedDoctor?.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedDoctor?.qualification}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-primary-500" /> {appointmentDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary-500" /> {selectedTimeSlot}
                  </span>
                  <span className="font-semibold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-cyan-300">
                    {appointmentType}
                  </span>
                </div>
              </div>
            </div>

            {/* Patient details recap */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block font-medium">Patient</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{patientName} ({patientAge}y, {patientGender})</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block font-medium">Contact</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{patientPhone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block font-medium">Email</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{patientEmail}</span>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800 border border-primary-100 dark:border-slate-700">
              <div className="flex justify-between items-center text-sm py-1">
                <span className="text-slate-600 dark:text-slate-300">Consultation OPD Fee</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{selectedDoctor?.consultation_fee || 800}.00</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-600 dark:text-slate-300">Hospital Tech & Triage Fee</span>
                <span className="font-semibold text-emerald-600">₹0.00 (Waived)</span>
              </div>
              <div className="flex justify-between items-center text-base font-bold pt-3">
                <span className="text-slate-900 dark:text-white">Total Amount Due</span>
                <span className="text-xl text-primary-600 dark:text-cyan-400">
                  ₹{selectedDoctor?.consultation_fee || 800}.00
                </span>
              </div>
            </div>

            {/* Razorpay Guarantee Notice */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Encrypted 256-bit checkout via Razorpay Test Gateway. Appointments confirmed only upon signature validation.
              </span>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isPaying}
                onClick={handleRazorpayPayment}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-700 hover:to-cyan-700 text-white font-bold text-sm shadow-lg shadow-primary-500/25 transition transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isPaying ? 'Processing Razorpay...' : `Pay ₹${selectedDoctor?.consultation_fee || 800} & Confirm`}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION RECEIPT */}
        {step === 4 && confirmedBooking && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-premium space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-600">
                Booking Confirmed & Verified
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white mt-1">
                Your Appointment is Scheduled!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
                A confirmation summary and digital visit token have been dispatched to <strong>{confirmedBooking.patient_email}</strong>.
              </p>
            </div>

            {/* Token Badge */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-xs text-slate-400">Appointment Token</span>
                <span className="font-mono text-xs font-bold text-primary-600 dark:text-cyan-400">
                  #{confirmedBooking.id.substring(0, 10).toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Doctor</span>
                  <span className="font-bold text-slate-900 dark:text-white">{confirmedBooking.doctor?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Department</span>
                  <span className="font-bold text-slate-900 dark:text-white">{confirmedBooking.department?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Date & Time</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {confirmedBooking.appointment_date} at {confirmedBooking.appointment_time}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Payment Ref</span>
                  <span className="font-bold text-emerald-600">{confirmedBooking.paymentId.substring(0, 14)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <Download className="w-4 h-4" />
                <span>Print Visit Slip</span>
              </button>

              <Link
                to="/dashboard/patient"
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow transition"
              >
                View in Patient Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
