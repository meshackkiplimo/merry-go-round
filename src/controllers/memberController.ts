import { Request, Response } from 'express';
import { User } from '../models/user'; 

export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const members = await User.find({}, 'name email'); 
    res.json(members);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch members', error: error.message });
  }
};