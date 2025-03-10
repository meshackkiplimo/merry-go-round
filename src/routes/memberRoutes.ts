import { Router } from 'express';
import { getAllMembers } from '../controllers/memberController';

const router = Router();


router.get('/', getAllMembers);

export default router;