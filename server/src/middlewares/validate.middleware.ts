import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      const formatted = err instanceof Error ? err.message : 'Invalid request data';
      return res.status(400).json({ success: false, message: formatted });
    }
  };
};
