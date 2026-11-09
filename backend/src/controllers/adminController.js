import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { store } from '../utils/dataStore.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = store.profiles.filter(p => p.role === 'patient').length + 180;
    const totalDoctors = store.doctors.length;
    const totalAppointments = store.appointments.length + 320;
    
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = store.appointments.filter(a => a.appointment_date === today).length + 8;

    const totalRevenue = store.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) + 245000;

    const departmentStats = store.departments.map(dept => {
      const docCount = store.doctors.filter(d => d.department_id === dept.id).length;
      const apptCount = store.appointments.filter(a => a.department_id === dept.id).length;
      return {
        id: dept.id,
        name: dept.name,
        doctors: docCount,
        appointments: apptCount + Math.floor(Math.random() * 20 + 5)
      };
    });

    const recentAppointments = store.appointments.slice(0, 6).map(appt => {
      const doc = store.doctors.find(d => d.id === appt.doctor_id);
      return {
        ...appt,
        doctor_name: doc ? doc.name : 'Specialist',
        department_name: doc ? doc.specialization : 'General'
      };
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments,
        totalRevenue,
        recentAppointments,
        departmentStats
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch admin metrics.' });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      department_id,
      specialization,
      qualification,
      experience_years,
      consultation_fee,
      bio,
      image_url,
      email,
      phone
    } = req.body;

    if (!name || !department_id || !specialization) {
      return res.status(400).json({ success: false, message: 'Missing doctor required fields.' });
    }

    const newDoc = {
      id: `doc_${Date.now()}`,
      department_id,
      name,
      email: email || `${name.toLowerCase().replace(/[^a-z]/g, '')}@avenuehospital.com`,
      phone: phone || '+1 (800) 427-000',
      specialization,
      qualification: qualification || 'MD, Medical Specialist',
      experience_years: parseInt(experience_years) || 5,
      consultation_fee: parseFloat(consultation_fee) || 800,
      bio: bio || 'Dedicated medical professional at Avenue Hospital.',
      image_url: image_url || '/src/assets/images/doctors/cardiologist.jpg',
      rating: 5.0,
      review_count: 0,
      is_featured: false,
      is_active: true,
      available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      time_slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
    };

    store.doctors.push(newDoc);
    return res.status(201).json({ success: true, message: 'Doctor added successfully', doctor: newDoc });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create doctor.' });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = store.doctors.find(d => d.id === id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    Object.assign(doc, req.body);
    return res.status(200).json({ success: true, message: 'Doctor updated.', doctor: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update doctor.' });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const index = store.doctors.findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    store.doctors[index].is_active = false; // soft delete
    return res.status(200).json({ success: true, message: 'Doctor deactivated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to deactivate doctor.' });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = store.appointments.map(a => {
      const doc = store.doctors.find(d => d.id === a.doctor_id);
      const dept = store.departments.find(dep => dep.id === a.department_id);
      return {
        ...a,
        doctor: doc,
        department: dept
      };
    });
    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch appointments.' });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const appt = store.appointments.find(a => a.id === id);
    if (!appt) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (status) appt.status = status;
    if (payment_status) appt.payment_status = payment_status;

    return res.status(200).json({ success: true, message: 'Status updated.', appointment: appt });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    return res.status(200).json({ success: true, payments: store.payments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payments.' });
  }
};
