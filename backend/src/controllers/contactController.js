import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { store } from '../utils/dataStore.js';

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({ name, email, phone, subject, message })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Thank you for reaching out! Our medical team will contact you shortly.', messageData: data });
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      name,
      email,
      phone,
      subject: subject || 'General Healthcare Inquiry',
      message,
      status: 'unread',
      created_at: new Date().toISOString()
    };

    store.contact_messages.unshift(newMessage);

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our medical coordination desk will respond within 24 hours.',
      messageData: newMessage
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Message submission failed.' });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    return res.status(200).json({ success: true, messages: store.contact_messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
  }
};
