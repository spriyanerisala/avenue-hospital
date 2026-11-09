import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { store } from '../utils/dataStore.js';

export const createAppointment = async (req, res) => {
  try {
    const {
      doctor_id,
      department_id,
      appointment_date,
      appointment_time,
      appointment_type,
      reason,
      patient_name,
      patient_email,
      patient_phone,
      patient_age,
      patient_gender
    } = req.body;

    if (!doctor_id || !appointment_date || !appointment_time || !patient_name || !patient_email || !patient_phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required appointment fields.' });
    }

    // Check date validity: cannot book in the past
    const selectedDate = new Date(`${appointment_date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return res.status(400).json({ success: false, message: 'Appointment date cannot be in the past.' });
    }

    // 1. Conflict Check: Verify doctor is not already booked at this exact slot
    if (isSupabaseConfigured) {
      const { data: conflict } = await supabase
        .from('appointments')
        .select('id')
        .eq('doctor_id', doctor_id)
        .eq('appointment_date', appointment_date)
        .eq('appointment_time', appointment_time)
        .in('status', ['confirmed', 'pending'])
        .maybeSingle();

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'This time slot has just been reserved. Please select another slot.'
        });
      }
    } else {
      const conflict = store.appointments.find(
        a => a.doctor_id === doctor_id &&
             a.appointment_date === appointment_date &&
             a.appointment_time === appointment_time &&
             a.status !== 'cancelled'
      );
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'This time slot has already been booked. Please choose an alternate slot.'
        });
      }
    }

    // Find Doctor to get fee
    const doctor = store.doctors.find(d => d.id === doctor_id);
    const consultation_fee = doctor ? doctor.consultation_fee : 800;

    const rawUserId = req.user ? req.user.id : null;
    const isValidUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const patient_id = (rawUserId && isValidUUID(rawUserId)) ? rawUserId : null;

    if (isSupabaseConfigured) {
      const { data: newAppt, error } = await supabase
        .from('appointments')
        .insert({
          patient_id,
          doctor_id,
          department_id: department_id || doctor?.department_id,
          appointment_date,
          appointment_time,
          appointment_type: appointment_type || 'In-Person',
          reason: reason || 'Consultation',
          patient_name,
          patient_email,
          patient_phone,
          patient_age: patient_age ? parseInt(patient_age) : null,
          patient_gender: patient_gender || 'Not Specified',
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment in Supabase:', error);
        throw error;
      }
      return res.status(201).json({
        success: true,
        message: 'Appointment initiated! Please complete payment.',
        appointment: newAppt,
        consultation_fee
      });
    }

    // Store in local data store
    const newAppointment = {
      id: `apt_${Date.now()}`,
      patient_id: rawUserId || `usr_pat_${Date.now()}`,
      doctor_id,
      department_id: department_id || doctor?.department_id,
      patient_name,
      patient_email,
      patient_phone,
      patient_age: patient_age ? parseInt(patient_age) : 30,
      patient_gender: patient_gender || 'Not Specified',
      appointment_date,
      appointment_time,
      appointment_type: appointment_type || 'In-Person',
      reason: reason || 'Medical consultation',
      status: 'pending',
      payment_status: 'pending',
      consultation_fee,
      created_at: new Date().toISOString()
    };

    store.appointments.unshift(newAppointment);

    return res.status(201).json({
      success: true,
      message: 'Appointment reserved successfully! Please complete payment to confirm.',
      appointment: newAppointment,
      consultation_fee
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ success: false, message: 'Could not create appointment.' });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const isValidUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    if (isSupabaseConfigured) {
      let query = supabase
        .from('appointments')
        .select('*, doctors(name, specialization, image_url, phone), departments(name)');

      if (isValidUUID(userId)) {
        query = query.or(`patient_id.eq.${userId},patient_email.eq.${userEmail}`);
      } else {
        query = query.eq('patient_email', userEmail);
      }

      const { data, error } = await query.order('appointment_date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments from Supabase:', error);
        throw error;
      }
      return res.status(200).json({ success: true, appointments: data || [] });
    }

    const userAppointments = store.appointments
      .filter(a => a.patient_id === userId || a.patient_email === userEmail)
      .map(appt => {
        const doc = store.doctors.find(d => d.id === appt.doctor_id);
        const dept = store.departments.find(d => d.id === appt.department_id);
        return {
          ...appt,
          doctor: doc,
          department: dept
        };
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return res.status(200).json({ success: true, appointments: userAppointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve appointments.' });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const doc = store.doctors.find(d => d.email === userEmail || d.id === req.user.id);
    const doctorId = doc?.id || 'doc_cardio_1'; // default demo

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      return res.status(200).json({ success: true, appointments: data });
    }

    const docAppointments = store.appointments.filter(a => a.doctor_id === doctorId);
    return res.status(200).json({ success: true, appointments: docAppointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving doctor schedule.' });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', updated_at: new Date() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Appointment cancelled.', appointment: data });
    }

    const appt = store.appointments.find(a => a.id === id);
    if (!appt) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    appt.status = 'cancelled';
    return res.status(200).json({ success: true, message: 'Appointment cancelled successfully.', appointment: appt });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Cancel request failed.' });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_date, new_time } = req.body;

    if (!new_date || !new_time) {
      return res.status(400).json({ success: false, message: 'New date and time required.' });
    }

    const appt = store.appointments.find(a => a.id === id);
    if (!appt) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Check conflict
    const conflict = store.appointments.find(
      a => a.id !== id &&
           a.doctor_id === appt.doctor_id &&
           a.appointment_date === new_date &&
           a.appointment_time === new_time &&
           a.status !== 'cancelled'
    );

    if (conflict) {
      return res.status(409).json({ success: false, message: 'Selected slot is already taken. Please choose another.' });
    }

    appt.appointment_date = new_date;
    appt.appointment_time = new_time;
    appt.status = 'confirmed';

    return res.status(200).json({ success: true, message: 'Appointment rescheduled successfully.', appointment: appt });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Reschedule failed.' });
  }
};
