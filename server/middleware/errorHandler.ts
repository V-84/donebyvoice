import type { NextFunction, Request, Response } from 'express';

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err);

  // Handle specific error types
  if (err.message.includes('duplicate key')) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'This email is already registered',
    });
  }

  if (err.message.includes('violates foreign key constraint')) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid referral code',
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
  });
}
