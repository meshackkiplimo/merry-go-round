import express from 'express';
import { register, login, me, updateProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); 


const router = express.Router();

router.post('/register', register);
router.post('/login', login);


router.get('/me',authMiddleware,me);
router.put('/update', authMiddleware, upload.single('image'), updateProfile); 
export default router;