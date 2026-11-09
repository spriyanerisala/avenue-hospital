import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_hospital_sample_key';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'sample_secret_key_hospital_123';

export const isRazorpayConfigured = Boolean(
  process.env.RAZORPAY_KEY_ID && 
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.includes('sample')
);

export const razorpayInstance = isRazorpayConfigured
  ? new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    })
  : null;

export const razorpayConfig = {
  keyId,
  keySecret,
  isConfigured: isRazorpayConfigured
};
