import express from 'express';
import { register, login, me, updateProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Fetch current user
router.get('/me',authMiddleware,me);
router.put('/update',authMiddleware,updateProfile);

export default router;