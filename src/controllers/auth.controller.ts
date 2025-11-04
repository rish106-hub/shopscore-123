import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AppError } from '../middlewares/error';
import { AuthUser } from '../types/user';

interface SignupBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// Extend the Request type to include our user
interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authController = {
  signup: async (req: Request<{}, {}, SignupBody>, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const { user, token } = await authService.signup({ name, email, password });
      res.status(201).json({ status: 'success', data: { user, token } });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create user', 500, 'SIGNUP_ERROR');
    }
  },

  login: async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login({ email, password });
      res.json({ status: 'success', data: { user, token } });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Login failed', 500, 'LOGIN_ERROR');
    }
  },

  getCurrentUser: async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }
    try {
      const user = await authService.getCurrentUser(req.user.id);
      res.json({ status: 'success', data: { user } });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch user', 500, 'FETCH_USER_ERROR');
    }
  },
};