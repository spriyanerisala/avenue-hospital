import express from 'express';
import {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  rescheduleAppointment
} from '../controllers/appointmentController.js';
import { verifyToken, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, createAppointment); // Can be initiated as guest or logged in patient
router.get('/my', verifyToken, getMyAppointments);
router.get('/doctor', verifyToken, requireRole('doctor', 'admin'), getDoctorAppointments);
router.patch('/:id/cancel', verifyToken, cancelAppointment);
router.patch('/:id/reschedule', verifyToken, rescheduleAppointment);

export default router;
