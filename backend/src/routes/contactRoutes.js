import express from 'express';
import { submitContactMessage, getContactMessages } from '../controllers/contactController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContactMessage);
router.get('/', verifyToken, requireRole('admin'), getContactMessages);

export default router;
