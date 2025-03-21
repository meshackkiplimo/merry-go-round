import express from 'express';
import { submitLoanApplication, getLoanHistory } from '../controllers/loanController';

const router = express.Router();

// POST /api/loans/apply - Submit a new loan application
router.post('/apply', submitLoanApplication);

// GET /api/loans/history - Get loan history
router.get('/history', getLoanHistory);

export default router;