import express, { Request, Response } from 'express';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import contributionRoutes from './routes/contributionRoutes';
import { logger } from './utils/logger';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000'], // Frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());


// Connect to MongoDB
connectDB();

// Routes
app.use('/api/user', authRoutes);
app.use('/api/contribution', contributionRoutes);

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Merry-Go-Round Backend is Running!');
});

const PORT = process.env.PORT ;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
  });
}

export { app };