import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
};

type UserCreateInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type UserUpdateInput = Partial<Omit<UserCreateInput, 'email'>> & { role?: 'ADMIN' | 'USER' };
type UserWhereUniqueInput = { id: string } | { email: string };
type UserWhereInput = any; // Simplified for now
type UserOrderByInput = any; // Simplified for now

export class UserRepository extends BaseRepository<
  User,
  UserCreateInput,
  UserUpdateInput,
  UserWhereUniqueInput,
  UserWhereInput,
  UserOrderByInput
> {
  constructor() {
    super('user');
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.prisma.user.findUnique({
      where: { email },
    });
    return result as User | null;
  }

  async updatePassword(id: string, passwordHash: string): Promise<User> {
    const result = await this.prisma.user.update({
      where: { id },
      data: { password: passwordHash },
    });
    return result as User;
  }
}