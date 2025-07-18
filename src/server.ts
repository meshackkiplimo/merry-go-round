import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import contributionRoutes from './routes/contributionRoutes';
import { logger } from './utils/logger';
import cors from 'cors';
import memberRoutes from './routes/memberRoutes';
import { authMiddleware } from './middleware/authMiddleware';
import mpesaRoutes from './routes/mpesaRoutes';
import loanRoutes from './routes/loanRoutes';

dotenv.config();
console.log('Environment Variables Loaded:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
});

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://merry-f.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

connectDB();

app.use('/api/user', authRoutes);
app.use('/api/contribution', contributionRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/contributions', mpesaRoutes);
app.use('/api/loans', loanRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Merry-Go-Round Backend is Running!');
});

if (require.main === module) {
  const PORT = process.env.PORT || 8001;
  app.listen(PORT, () => {
    logger.info(`Server running on: http://localhost:${PORT}`);
  });
}

export default app;