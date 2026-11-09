import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './src/routes/authRoutes.js';
import doctorRoutes from './src/routes/doctorRoutes.js';
import departmentRoutes from './src/routes/departmentRoutes.js';
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow dev mode
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logger
app.use(morgan('dev'));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

app.use('/api', apiLimiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check & Root Info
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Avenue Multi-Specialty Hospital Backend API',
    version: '1.0.0',
    documentation: 'All API routes are served under /api prefix',
    endpoints: {
      health: '/api/health',
      doctors: '/api/doctors',
      departments: '/api/departments',
      appointments: '/api/appointments',
      auth: '/api/auth',
      payments: '/api/payments'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Avenue Multi-Specialty Hospital Backend API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// 404 Route
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏥 Avenue Hospital Backend API is running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
