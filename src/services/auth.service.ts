import { signToken } from '../utils/jwt';
import { hashPassword, verifyPassword } from '../utils/passwords';
import { UserRepository } from '../repositories/users.repo';
import { AppError } from '../middlewares/error';

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
};

type UserWithoutPassword = Omit<User, 'password'>;

const userRepository = new UserRepository();

type LoginInput = {
  email: string;
  password: string;
};

type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export class AuthService {
  async login({ email, password }: LoginInput): Promise<{ user: UserWithoutPassword; token: string }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect email or password', 401, 'UNAUTHORIZED');
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Incorrect email or password', 401, 'UNAUTHORIZED');
    }

    const token = signToken({ id: user.id, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async signup({ name, email, password }: SignupInput): Promise<{ user: UserWithoutPassword; token: string }> {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already in use', 400, 'EMAIL_IN_USE');
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'USER', // Default role
    });

    const token = signToken({ id: user.id, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getCurrentUser(userId: string): Promise<UserWithoutPassword> {
    const user = await userRepository.findUnique({ id: userId });
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();