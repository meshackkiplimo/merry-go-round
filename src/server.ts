import express, { Request, Response } from 'express';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import contributionRoutes from './routes/contributionRoutes';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', contributionRoutes);

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Merry-Go-Round Backend is Running!');
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});