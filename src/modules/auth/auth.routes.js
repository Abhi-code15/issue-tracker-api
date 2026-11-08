import { Router } from 'express';
import * as authController from './auth.controller.js';
import { protect } from '../../middlewares/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected endpoint
router.get('/me', protect, authController.getMe);

export default router;