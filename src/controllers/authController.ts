import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
});



export const me = async (req: Request, res: Response) => {
  try {
    console.log('Fetching User - req.user:', req.user);

    if (!req.user) {
      console.log('No req.user - Unauthorized');
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      res.status(404).json({ message: 'User not found' });
      return;
    }

    console.log('Fetched User:', user); // Debug fetched user
    res.json(user);
  } catch (error: any) {
    console.error('Fetch User Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    return;
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash });
    await user.save();
    console.log('User registered:', { name, email });
    res.status(201).json({ message: 'User registered' });
    return;
  } catch (error: any) {
    console.error('Register Error:', error.message);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      console.log('Invalid credentials for:', email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not defined');
      throw new Error('JWT_SECRET not defined');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: '5h' }
    );
    console.log('Generated Token:', token); // Debug token
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    return;
  } catch (error: any) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error' });
    return;  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    console.log('Updating Profile - req.user:', req.user);
    if (!req.user) {
      console.log('No req.user - Unauthorized');
      res.status(401).json({ message: 'Unauthorized' });
      return 
    }

    const { name, location, jobStatus, familyName,gender } = req.body;
    console.log('Update Request Bodyjjjjj:', { name, location, jobStatus, familyName,gender });

    let imageUrl = req.body.imageUrl; // Existing URL if no new file
    if (req.file) { // Multer provides req.file for uploaded image
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'merry-go-round/profiles',
          public_id: `${req.user.id}_${Date.now()}`,
        });
        imageUrl = uploadResult.secure_url;
        console.log('Uploaded Image to Cloudinary:', imageUrl);
      } catch (uploadError: any) {
        console.error('Cloudinary Upload Error:', uploadError.message);
        res.status(500).json({ message: 'Failed to upload image', error: uploadError.message });
        return 
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        imageUrl,
        location,
        jobStatus,
        familyName,
        gender
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.log('User not found for ID:', req.user.id);
      res.status(404).json({ message: 'User not found' });
      return 
    }

    console.log('Updated User:', user);
    res.json(user);
  } catch (error: any) {
    console.error('Update Profile Error:', error.message);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};
