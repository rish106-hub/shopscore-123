import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface ErrorWithCode extends Error {
  code?: string;
  statusCode?: number;
  details?: any;
  meta?: any;
  errors?: Array<{ path: string[]; message: string }>;
  name: string;
}

export class AppError extends Error implements ErrorWithCode {
  statusCode: number;
  code?: string;
  details?: any;
  name: string;

  constructor(message: string, statusCode: number, code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: ErrorWithCode | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.[0] || 'field';
      return res.status(409).json({
        success: false,
        message: `A record with this ${target} already exists`,
        code: 'DUPLICATE_RECORD',
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'The requested resource was not found',
        code: 'NOT_FOUND',
      });
    }
  }

  if (err.name === 'AppError') {
    return res.status((err as AppError).statusCode).json({
      success: false,
      message: err.message,
      code: (err as AppError).code || 'INTERNAL_ERROR',
      details: (err as AppError).details,
    });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: (err as any).errors?.map((e: any) => ({
        path: e.path?.join('.') || '',
        message: e.message,
      })) || [],
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      code: 'INVALID_TOKEN',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      code: 'TOKEN_EXPIRED',
    });
  }

  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`,
    code: 'NOT_FOUND',
  });
};
