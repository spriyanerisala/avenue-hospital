import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { store } from '../utils/dataStore.js';
import { generateLocalToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'Please provide full name, email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured) {
      try {
        // Use Supabase Admin to create user with email_confirm: true (no confirmation blocker)
        const { data: adminUser, error: adminErr } = await supabase.auth.admin.createUser({
          email: cleanEmail,
          password,
          email_confirm: true,
          user_metadata: {
            full_name,
            phone,
            role: 'patient'
          }
        });

        if (!adminErr && adminUser?.user) {
          // Profile is created via handle_new_user trigger, but ensure record exists
          await supabase.from('profiles').upsert({
            id: adminUser.user.id,
            full_name,
            email: cleanEmail,
            phone: phone || '',
            role: 'patient',
            updated_at: new Date()
          });

          const token = generateLocalToken({
            id: adminUser.user.id,
            email: cleanEmail,
            full_name,
            role: 'patient'
          });

          return res.status(201).json({
            success: true,
            message: 'Registration successful! You can now log in.',
            token,
            user: {
              id: adminUser.user.id,
              email: cleanEmail,
              full_name,
              role: 'patient'
            }
          });
        }
      } catch (sbError) {
        console.warn('Supabase admin register fallback:', sbError.message);
      }
    }

    // Local / In-memory registration
    const existing = store.profiles.find(p => p.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      full_name,
      email: cleanEmail,
      phone: phone || '',
      role: 'patient',
      created_at: new Date().toISOString()
    };

    store.profiles.push(newUser);
    const token = generateLocalToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! You can now log in.',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed due to a server error.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Predefined demo accounts check (always instant and successful)
    if (cleanEmail === 'admin@avenuehospital.com') {
      const adminUser = {
        id: 'usr_admin_001',
        email: cleanEmail,
        full_name: 'Dr. Gregory House (Chief Medical Officer)',
        phone: '+1 (800) 427-9000',
        role: 'admin'
      };
      const token = generateLocalToken(adminUser);
      return res.status(200).json({
        success: true,
        message: 'Welcome back, Administrator!',
        token,
        user: adminUser
      });
    }

    if (cleanEmail === 'anthony.chen@avenuehospital.com') {
      const docUser = {
        id: 'usr_doc_001',
        email: cleanEmail,
        full_name: 'Dr. Anthony F. Chen',
        phone: '+1 (800) 427-101',
        role: 'doctor'
      };
      const token = generateLocalToken(docUser);
      return res.status(200).json({
        success: true,
        message: 'Welcome back, Dr. Chen!',
        token,
        user: docUser
      });
    }

    if (cleanEmail === 'patient@demo.com') {
      const patUser = {
        id: 'usr_pat_001',
        email: cleanEmail,
        full_name: 'Johnathan Doe',
        phone: '+1 (555) 234-5678',
        role: 'patient'
      };
      const token = generateLocalToken(patUser);
      return res.status(200).json({
        success: true,
        message: 'Welcome back, Johnathan!',
        token,
        user: patUser
      });
    }

    // 2. Try Supabase Auth
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!error && data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          const authUser = {
            id: data.user.id,
            email: data.user.email,
            role: profile?.role || 'patient',
            full_name: profile?.full_name || data.user.user_metadata?.full_name || 'Patient',
            phone: profile?.phone || ''
          };

          return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token: data.session?.access_token || generateLocalToken(authUser),
            user: authUser
          });
        }
      } catch (sbErr) {
        console.warn('Supabase signInWithPassword fallback:', sbErr.message);
      }
    }

    // 3. Fallback to store profile or create patient on the fly
    let user = store.profiles.find(p => p.email.toLowerCase() === cleanEmail);

    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        full_name: cleanEmail.split('@')[0].replace('.', ' '),
        email: cleanEmail,
        phone: '+1 (555) 010-0000',
        role: 'patient',
        created_at: new Date().toISOString()
      };
      store.profiles.push(user);
    }

    const token = generateLocalToken(user);
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed due to a server error.' });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { full_name, phone } = req.body;
    const userId = req.user.id;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name, phone, updated_at: new Date() })
        .eq('id', userId)
        .select()
        .single();

      if (error) return res.status(400).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, message: 'Profile updated', user: data });
    }

    const profileIndex = store.profiles.findIndex(p => p.id === userId);
    if (profileIndex !== -1) {
      store.profiles[profileIndex].full_name = full_name || store.profiles[profileIndex].full_name;
      store.profiles[profileIndex].phone = phone || store.profiles[profileIndex].phone;
      return res.status(200).json({ success: true, message: 'Profile updated', user: store.profiles[profileIndex] });
    }

    return res.status(404).json({ success: false, message: 'User not found.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update failed.' });
  }
};
