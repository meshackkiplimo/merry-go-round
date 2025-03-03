import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request type to include user (if not already in express.d.ts)
declare module 'express' {
  interface Request {
    user?: { id: string; role: string }; // Matches your JWT payload
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return 
    
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return 
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as { id: string; role: string };
    req.user = decoded; 
    next();
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
    return 
    
  }
};