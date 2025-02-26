import express from 'express';
import { logContribution, getHistory } from '../controllers/contributionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/contributions', authMiddleware, logContribution);
router.get('/history', authMiddleware, getHistory);

export default router;