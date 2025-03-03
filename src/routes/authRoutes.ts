import express from 'express';
import { register, login, me } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Fetch current user
router.get('/me',authMiddleware,me);

export default router;