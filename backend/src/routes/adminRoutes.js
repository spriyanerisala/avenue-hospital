import express from 'express';
import {
  getDashboardStats,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllAppointments,
  updateAppointmentStatus,
  getAllPayments
} from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Require admin role for all admin operations
router.use(verifyToken, requireRole('admin'));

router.get('/stats', getDashboardStats);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

router.get('/appointments', getAllAppointments);
router.patch('/appointments/:id/status', updateAppointmentStatus);

router.get('/payments', getAllPayments);

export default router;
