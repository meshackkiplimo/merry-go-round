import { Request, Response } from 'express';
import { Contribution } from '../models/contribution';

export const logContribution = async (req: Request, res: Response) => {
  const { userId, amount, cycleNumber } = req.body;
  try {
    const contribution = new Contribution({ userId, amount, cycleNumber });
    await contribution.save();
    res.json({ message: 'Contribution logged' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const history = await Contribution.find().populate('userId', 'name');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};