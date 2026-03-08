import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  referredBy: z.string().optional(),
});

/**
 * Referral code validation schema
 */
export const referralCodeSchema = z.object({
  code: z.string().min(1, 'Referral code is required'),
});

/**
 * Generic validation middleware factory
 */
export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };
}
