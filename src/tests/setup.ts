import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';

beforeAll(async () => {
  await connectDB();
}, 10000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await disconnectDB();
}, 10000);

// Export app for tests
export { app } from '../server';