import { Request, Response } from 'express';
import { User } from '../models/user';

export const getAllMembers = async (req: Request, res: Response) => {
  try {
    // Fetch all fields except passwordHash
    const members = await User.find({}, '-passwordHash');
    console.log('Fetched Members:', members); // Debug returned data
    res.json(members);
  } catch (error: any) {
    console.error('Fetch Members Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch members', error: error.message });
  }
};