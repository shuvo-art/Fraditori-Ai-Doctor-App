import express, { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { registerUser, loginUser, generateOTP, verifyOTP } from './auth.service';
import { User } from '../user/user.model';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const otpRequestSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
  newPassword: z.string().min(8),
});

// Signup route
router.post(
  '/signup',
  (async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = signupSchema.parse(req.body);
      const user = await registerUser(email, password, name);
      res.status(201).json({ success: true, user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }) as RequestHandler
);

// Login route
router.post(
  '/login',
  (async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const { user, token, role } = await loginUser(email, password);
      res.status(200).json({ success: true, user, token, role }); // Include the role in the response
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }) as RequestHandler
);

// Send OTP for password reset
router.post(
  '/password/reset',
  (async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = otpRequestSchema.parse(req.body);
      await generateOTP(email);
      res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }) as RequestHandler
);

// Verify OTP and reset password
router.post(
  '/password/reset/verify',
  (async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp, newPassword } = resetPasswordSchema.parse(req.body);

      if (!verifyOTP(email, otp)) {
        res.status(400).json({ success: false, message: 'Invalid OTP' });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate({ email }, { password: hashedPassword });
      res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }) as RequestHandler
);

export default router;
