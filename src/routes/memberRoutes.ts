import { Router } from 'express';
import { getAllMembers } from '../controllers/memberController';

const router = Router();

// GET /api/members - Fetch all members
router.get('/', getAllMembers);

export default router;