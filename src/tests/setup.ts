import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import app from '../server';

beforeAll(async () => {
  await connectDB();
}, 10000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await disconnectDB();
}, 10000);
export default app;
