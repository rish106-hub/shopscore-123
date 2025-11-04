import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from './error';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = {
        ...req.params,
        ...(req.query && Object.keys(req.query).length > 0 ? { query: req.query } : {}),
        ...(req.body && Object.keys(req.body).length > 0 ? { body: req.body } : {}),
      };

      const result = schema.safeParse(data);

      if (!result.success) {
        const error = new AppError(
          'Validation failed',
          400,
          'VALIDATION_ERROR',
          result.error.format()
        );
        error.name = 'ZodError';
        throw error;
      }

      const validatedData = result.data as Record<string, any>;
      
      if ('body' in validatedData) {
        req.body = validatedData.body;
      }
      if ('query' in validatedData) {
        req.query = validatedData.query;
      }
      if ('params' in validatedData) {
        req.params = validatedData.params;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const schemas = {
  idParam: z.object({
    id: z.string().uuid('Invalid ID format'),
  }),
  
  pagination: z.object({
    query: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    }),
  }),

  searchQuery: z.object({
    query: z.object({
      q: z.string().optional(),
    }),
  }),

  signup: z.object({
    body: z.object({
      name: z.string().min(2).max(100),
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(1, 'Password is required'),
    }),
  }),

  createProduct: z.object({
    body: z.object({
      title: z.string().min(2).max(200),
      description: z.string().min(10),
      price: z.number().int().positive(),
      stock: z.number().int().min(0),
      category: z.string().min(2).max(100),
      images: z.array(z.string().url('Invalid image URL')).optional().default([]),
    }),
  }),

  updateProduct: z.object({
    body: z.object({
      title: z.string().min(2).max(200).optional(),
      description: z.string().min(10).optional(),
      price: z.number().int().positive().optional(),
      stock: z.number().int().min(0).optional(),
      category: z.string().min(2).max(100).optional(),
      images: z.array(z.string().url('Invalid image URL')).optional(),
    }),
  }),

  createReview: z.object({
    body: z.object({
      rating: z.number().int().min(1).max(5),
      title: z.string().min(2).max(200),
      body: z.string().min(10),
    }),
    params: z.object({
      productId: z.string().uuid('Invalid product ID'),
    }),
  }),

  createOrder: z.object({
    body: z.object({
      items: z.array(
        z.object({
          productId: z.string().uuid('Invalid product ID'),
          qty: z.number().int().positive(),
        })
      ).min(1, 'At least one item is required'),
    }),
  }),

  updateOrderStatus: z.object({
    params: z.object({
      id: z.string().uuid('Invalid order ID'),
    }),
    body: z.object({
      status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
    }),
  }),
};
