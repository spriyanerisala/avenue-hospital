import jwt from 'jsonwebtoken';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { store } from '../utils/dataStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'avenue_hospital_secure_jwt_secret_2026';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // 1. Handle 1-click Demo Tokens
    if (token.startsWith('demo_token_')) {
      const role = token.replace('demo_token_', '');
      let full_name = 'Patient User';
      let email = 'patient@demo.com';

      if (role === 'admin') {
        full_name = 'Hospital Executive Administrator';
        email = 'admin@avenuehospital.com';
      } else if (role === 'doctor') {
        full_name = 'Dr. Anthony F. Chen';
        email = 'anthony.chen@avenuehospital.com';
      }

      req.user = {
        id: `usr_${role}_001`,
        email,
        full_name,
        role: role
      };
      return next();
    }

    // 2. Try Local JWT verification
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = store.profiles.find(p => p.id === decoded.id || p.email === decoded.email);
      if (user) {
        req.user = { ...user, role: user.role };
      } else {
        req.user = decoded;
      }
      return next();
    } catch (jwtErr) {
      // If not a local JWT, proceed to Supabase verification if available
    }

    // 3. Supabase Live Token verification
    if (isSupabaseConfigured) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          req.user = {
            id: user.id,
            email: user.email,
            role: profile?.role || user.user_metadata?.role || 'patient',
            full_name: profile?.full_name || user.user_metadata?.full_name || 'User'
          };
          return next();
        }
      } catch (sbErr) {
        console.warn('Supabase token verification check error:', sbErr.message);
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, message: 'Internal authentication error.' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    // 1. Handle 1-click Demo Tokens
    if (token.startsWith('demo_token_')) {
      const role = token.replace('demo_token_', '');
      let full_name = 'Patient User';
      let email = 'patient@demo.com';

      if (role === 'admin') {
        full_name = 'Hospital Executive Administrator';
        email = 'admin@avenuehospital.com';
      } else if (role === 'doctor') {
        full_name = 'Dr. Anthony F. Chen';
        email = 'anthony.chen@avenuehospital.com';
      }

      req.user = {
        id: `usr_${role}_001`,
        email,
        full_name,
        role: role
      };
      return next();
    }

    // 2. Try Local JWT verification
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = store.profiles.find(p => p.id === decoded.id || p.email === decoded.email);
      if (user) {
        req.user = { ...user, role: user.role };
      } else {
        req.user = decoded;
      }
      return next();
    } catch (jwtErr) {
      // Continue to Supabase
    }

    // 3. Supabase Live Token verification
    if (isSupabaseConfigured) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          req.user = {
            id: user.id,
            email: user.email,
            role: profile?.role || user.user_metadata?.role || 'patient',
            full_name: profile?.full_name || user.user_metadata?.full_name || 'User'
          };
          return next();
        }
      } catch (sbErr) {
        // Token invalid, proceed as guest
      }
    }

    return next();
  } catch (err) {
    return next();
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires ${roles.join(' or ')} privileges.`
      });
    }

    next();
  };
};

export const generateLocalToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
