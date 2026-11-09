import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hospital_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired, clear auth session
      // localStorage.removeItem('hospital_token');
      // localStorage.removeItem('hospital_user');
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Department Services
export const departmentService = {
  getAll: () => api.get('/departments'),
  getBySlug: (slug) => api.get(`/departments/${slug}`),
};

// Doctor Services
export const doctorService = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  getAvailability: (id, date) => api.get(`/doctors/${id}/availability`, { params: { date } }),
};

// Appointment Services
export const appointmentService = {
  create: (data) => api.post('/appointments', data),
  getMy: () => api.get('/appointments/my'),
  getDoctorAppointments: () => api.get('/appointments/doctor'),
  cancel: (id) => api.patch(`/appointments/${id}/cancel`),
  reschedule: (id, data) => api.patch(`/appointments/${id}/reschedule`, data),
};

// Payment Services
export const paymentService = {
  createOrder: (appointmentId) => api.post('/payments/create-order', { appointment_id: appointmentId }),
  verifyPayment: (data) => api.post('/payments/verify', data),
};

// Admin Services
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  createDoctor: (data) => api.post('/admin/doctors', data),
  updateDoctor: (id, data) => api.put(`/admin/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
  getAppointments: () => api.get('/admin/appointments'),
  updateAppointmentStatus: (id, data) => api.patch(`/admin/appointments/${id}/status`, data),
  getPayments: () => api.get('/admin/payments'),
};

// Contact Services
export const contactService = {
  submit: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
};

export default api;
