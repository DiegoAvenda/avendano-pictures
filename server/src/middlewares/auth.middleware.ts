import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: User;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token =
      // Prefer HttpOnly cookie
      req.cookies?.token ||
      // Fallback to Authorization header Bearer token
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};
