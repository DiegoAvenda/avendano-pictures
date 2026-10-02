import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// @types/jsonwebtoken types `expiresIn` as `number | ms.StringValue`, so a plain
// `string` from process.env must be narrowed to that union.
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  '7d') as SignOptions['expiresIn'];

// Helper to generate JWT and set as HttpOnly cookie
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const register = async (req: Request<{}, {}, RegisterInput>, res: Response) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ email, password: hashed });
    const token = generateToken(user.id);
    res
      .cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(201)
      .json({ success: true, data: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (req: Request<{}, {}, LoginInput>, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = generateToken(user.id);
    res
      .cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ success: true, data: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token').status(200).json({ success: true, message: 'Logged out' });
};

export const getMe = (req: Request, res: Response) => {
  // Assuming auth middleware populated req.user
  const user = (req as any).user as IUser;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  res.status(200).json({ success: true, data: { id: user.id, email: user.email } });
};
