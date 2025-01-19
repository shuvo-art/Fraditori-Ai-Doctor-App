import express from 'express';
import { getUserProfile, updateUserProfile } from './user.controller';
import { authenticate } from '../auth/auth.middleware';

const router = express.Router();

router.get('/profile', authenticate, getUserProfile); // Accessible to all authenticated users
router.put('/profile', authenticate, updateUserProfile); // Accessible to all authenticated users

export default router;
