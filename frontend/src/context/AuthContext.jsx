import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('hospital_token'));
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('hospital_token');
      const storedUser = localStorage.getItem('hospital_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const res = await authService.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('hospital_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('Session verification fallback to stored user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.data?.success) {
        const { user: authUser, token: authToken } = res.data;
        setUser(authUser);
        setToken(authToken);
        localStorage.setItem('hospital_token', authToken);
        localStorage.setItem('hospital_user', JSON.stringify(authUser));
        toast.success(`Welcome back, ${authUser.full_name}!`);
        return { success: true, user: authUser };
      }
      throw new Error(res.data?.message || 'Login failed');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.data?.success) {
        toast.success('Registration successful! Please login.');
        return { success: true };
      }
      throw new Error(res.data?.message || 'Registration failed');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hospital_token');
    localStorage.removeItem('hospital_user');
    toast.info('Logged out successfully.');
  };

  // Demo 1-click login helper
  const demoLogin = async (role) => {
    let email = 'patient@demo.com';
    let name = 'Demo Patient';
    if (role === 'doctor') {
      email = 'anthony.chen@avenuehospital.com';
      name = 'Dr. Anthony F. Chen';
    } else if (role === 'admin') {
      email = 'admin@avenuehospital.com';
      name = 'Hospital Admin';
    }

    const demoUser = {
      id: `usr_${role}_001`,
      email,
      full_name: name,
      role: role
    };
    const mockToken = `demo_token_${role}`;

    setUser(demoUser);
    setToken(mockToken);
    localStorage.setItem('hospital_token', mockToken);
    localStorage.setItem('hospital_user', JSON.stringify(demoUser));
    toast.success(`Signed in as ${name} (${role.toUpperCase()})`);
    return demoUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        isDoctor: user?.role === 'doctor',
        isPatient: user?.role === 'patient',
        login,
        register,
        logout,
        demoLogin,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
