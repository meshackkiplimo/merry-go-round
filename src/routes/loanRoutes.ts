import express from 'express';
import { submitLoanApplication, getLoanHistory } from '../controllers/loanController';

const router = express.Router();

// POST /api/loans/apply - Submit a new loan application
router.post('/apply', submitLoanApplication);

// GET /api/loans - Get all loan applications
router.get('/', getLoanHistory);

// GET /api/loans/history - Get loan history (deprecated)
router.get('/history', getLoanHistory);

export default router;