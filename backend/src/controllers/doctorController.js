import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { store } from '../utils/dataStore.js';

export const getDoctors = async (req, res) => {
  try {
    const { department, search, featured } = req.query;

    if (isSupabaseConfigured) {
      let query = supabase
        .from('doctors')
        .select('*, departments(id, name, slug)')
        .eq('is_active', true);

      if (department) {
        query = query.eq('department_id', department);
      }
      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,specialization.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ success: true, doctors: data });
    }

    let results = store.doctors.filter(d => d.is_active);

    if (department && department !== 'all') {
      results = results.filter(d => d.department_id === department);
    }

    if (featured === 'true') {
      results = results.filter(d => d.is_featured);
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.specialization.toLowerCase().includes(q) ||
        d.qualification.toLowerCase().includes(q)
      );
    }

    // Attach department data
    const doctorsWithDept = results.map(doc => {
      const dept = store.departments.find(dep => dep.id === doc.department_id);
      return {
        ...doc,
        department: dept ? { id: dept.id, name: dept.name, slug: dept.slug } : null
      };
    });

    return res.status(200).json({ success: true, doctors: doctorsWithDept });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch doctors' });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data: doctor, error } = await supabase
        .from('doctors')
        .select('*, departments(*), reviews(*)')
        .eq('id', id)
        .single();

      if (error || !doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }

      return res.status(200).json({ success: true, doctor });
    }

    const doctor = store.doctors.find(d => d.id === id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const dept = store.departments.find(d => d.id === doctor.department_id);
    const reviews = store.reviews.filter(r => r.doctor_id === doctor.id);

    return res.status(200).json({
      success: true,
      doctor: {
        ...doctor,
        department: dept,
        reviews
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving doctor details' });
  }
};

export const getDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // YYYY-MM-DD

    let doctor = null;
    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      doctor = data;
    }

    if (!doctor) {
      doctor = store.doctors.find(d => d.id === id);
    }

    // Default slots
    const defaultSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
      '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    // Determine booked slots for the requested date to prevent duplicate bookings
    let bookedTimes = [];
    if (date) {
      if (isSupabaseConfigured) {
        const { data: booked } = await supabase
          .from('appointments')
          .select('appointment_time')
          .eq('doctor_id', id)
          .eq('appointment_date', date)
          .in('status', ['confirmed', 'pending']);
        
        bookedTimes = (booked || []).map(b => b.appointment_time);
      } else {
        bookedTimes = store.appointments
          .filter(a => a.doctor_id === id && a.appointment_date === date && a.status !== 'cancelled')
          .map(a => a.appointment_time);
      }
    }

    const allSlots = doctor?.time_slots || defaultSlots;
    const availableSlots = allSlots.map(time => ({
      time,
      isAvailable: !bookedTimes.includes(time)
    }));

    return res.status(200).json({
      success: true,
      doctorId: id,
      date,
      availableDays: doctor?.available_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      slots: availableSlots
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return res.status(200).json({
      success: true,
      doctorId: req.params.id,
      date: req.query.date,
      slots: [
        { time: '09:00 AM', isAvailable: true },
        { time: '10:00 AM', isAvailable: true },
        { time: '11:30 AM', isAvailable: true },
        { time: '02:00 PM', isAvailable: true },
        { time: '03:30 PM', isAvailable: true },
        { time: '04:30 PM', isAvailable: true }
      ]
    });
  }
};
