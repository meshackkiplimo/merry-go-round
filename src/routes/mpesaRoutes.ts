import { Router } from 'express';
import { initiateStkPush, confirmPayment, logContribution } from '../controllers/mpesaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/stk-push', authMiddleware, initiateStkPush);
router.post('/confirm', authMiddleware, confirmPayment);
router.post('/contributions', authMiddleware, logContribution);

export default router;