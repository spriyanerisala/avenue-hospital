import crypto from 'crypto';
import { razorpayInstance, razorpayConfig } from '../config/razorpay.js';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { store } from '../utils/dataStore.js';

export const createRazorpayOrder = async (req, res) => {
  try {
    const { appointment_id } = req.body;

    if (!appointment_id) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required.' });
    }

    // Retrieve appointment
    let appointment = null;
    let doctor = null;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, doctors(*)')
        .eq('id', appointment_id)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
      appointment = data;
      doctor = data.doctors;
    } else {
      appointment = store.appointments.find(a => a.id === appointment_id);
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
      doctor = store.doctors.find(d => d.id === appointment.doctor_id);
    }

    const amountInINR = doctor ? doctor.consultation_fee : (appointment.consultation_fee || 800);
    const amountInPaise = Math.round(amountInINR * 100);

    // If real Razorpay client is initialized
    if (razorpayInstance) {
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${appointment.id.substring(0, 8)}`,
        notes: {
          appointment_id: appointment.id,
          doctor_name: doctor?.name || 'Specialist Doctor',
          patient_name: appointment.patient_name
        }
      };

      const order = await razorpayInstance.orders.create(options);

      return res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: razorpayConfig.keyId,
        doctorName: doctor?.name,
        patientName: appointment.patient_name
      });
    }

    // Test mode fallback order generation
    const mockOrderId = `order_test_${Date.now()}`;
    return res.status(200).json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: razorpayConfig.keyId,
      doctorName: doctor?.name,
      patientName: appointment.patient_name,
      isTestMode: true
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create payment order.' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      appointment_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!appointment_id || !razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: 'Missing payment verification credentials.' });
    }

    let isValid = false;

    // Perform cryptographic signature verification
    if (razorpayConfig.isConfigured && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', razorpayConfig.keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValid = (generatedSignature === razorpay_signature);
    } else {
      // In test mode / sandbox simulation
      isValid = Boolean(razorpay_payment_id && razorpay_order_id);
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid digital signature.'
      });
    }

    // Payment is valid! Fetch the appointment to get the real fee
    let appointmentAmount = 0;

    if (isSupabaseConfigured) {
      // 1. Look up the appointment + doctor fee for the actual amount
      const { data: apptData, error: apptFetchErr } = await supabase
        .from('appointments')
        .select('*, doctors(consultation_fee, name)')
        .eq('id', appointment_id)
        .single();

      if (apptFetchErr || !apptData) {
        console.error('Could not fetch appointment for payment:', apptFetchErr);
        return res.status(404).json({ success: false, message: 'Appointment not found for payment verification.' });
      }

      appointmentAmount = apptData.doctors?.consultation_fee || 800;

      // 2. Insert payment into Supabase payments table
      //    Let the DB auto-generate `id` (uuid) and `created_at`/`updated_at`
      const { data: insertedPayment, error: payInsertErr } = await supabase
        .from('payments')
        .insert({
          appointment_id,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature: razorpay_signature || 'verified_in_test_sandbox',
          amount: appointmentAmount,
          currency: 'INR',
          status: 'captured',
          method: 'Razorpay Verified Gateway',
          receipt: `rcpt_${appointment_id.substring(0, 8)}`,
          metadata: {
            patient_name: apptData.patient_name,
            doctor_name: apptData.doctors?.name || 'Specialist',
            appointment_date: apptData.appointment_date,
            appointment_time: apptData.appointment_time
          }
        })
        .select()
        .single();

      if (payInsertErr) {
        console.error('❌ Supabase payment insert error:', payInsertErr);
        // Still try to confirm the appointment even if payment record fails
      } else {
        console.log('✅ Payment recorded in Supabase:', insertedPayment?.id);
      }

      // 3. Update appointment status
      const { data: updatedAppt, error } = await supabase
        .from('appointments')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment_id)
        .select()
        .single();

      if (error) {
        console.error('❌ Appointment status update error:', error);
        throw error;
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified and appointment confirmed successfully!',
        appointment: updatedAppt,
        payment: insertedPayment || { razorpay_payment_id, razorpay_order_id, amount: appointmentAmount }
      });
    }

    // Local data store update
    const paymentRecord = {
      id: `pay_${Date.now()}`,
      appointment_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: razorpay_signature || 'verified_in_test_sandbox',
      amount: 0,
      currency: 'INR',
      status: 'captured',
      method: 'Razorpay Verified Gateway',
      created_at: new Date().toISOString()
    };

    store.payments.push(paymentRecord);
    const appt = store.appointments.find(a => a.id === appointment_id);
    if (appt) {
      appt.status = 'confirmed';
      appt.payment_status = 'paid';
      paymentRecord.amount = appt.consultation_fee || 1000;
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and appointment confirmed successfully!',
      appointment: appt,
      payment: paymentRecord
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ success: false, message: 'Server error during payment verification.' });
  }
};
