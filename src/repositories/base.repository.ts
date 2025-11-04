import { PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';

type PrismaModel = keyof Omit<
  PrismaClient,
  | '$connect'
  | '$disconnect'
  | '$on'
  | '$transaction'
  | '$use'
  | '$executeRaw'
  | '$executeRawUnsafe'
  | '$queryRaw'
  | '$queryRawUnsafe'
>;

export abstract class BaseRepository<
  T,
  CreateInput,
  UpdateInput,
  WhereUniqueInput,
  WhereInput,
  OrderByInput
> {
  protected prisma: PrismaClient;
  protected model: PrismaModel;

  constructor(model: PrismaModel) {
    this.prisma = prisma;
    this.model = model;
  }

  async findMany(
    where?: WhereInput,
    orderBy?: OrderByInput,
    skip?: number,
    take?: number
  ): Promise<T[]> {
    return (this.prisma[this.model] as any).findMany({
      where,
      orderBy,
      skip,
      take,
    });
  }

  async findUnique(where: WhereUniqueInput): Promise<T | null> {
    return (this.prisma[this.model] as any).findUnique({
      where,
    });
  }

  async create(data: CreateInput): Promise<T> {
    return (this.prisma[this.model] as any).create({
      data,
    });
  }

  async update(where: WhereUniqueInput, data: UpdateInput): Promise<T> {
    return (this.prisma[this.model] as any).update({
      where,
      data,
    });
  }

  async delete(where: WhereUniqueInput): Promise<T> {
    return (this.prisma[this.model] as any).delete({
      where,
    });
  }

  async count(where?: WhereInput): Promise<number> {
    return (this.prisma[this.model] as any).count({
      where,
    });
  }

  async exists(where: WhereUniqueInput): Promise<boolean> {
    const count = await (this.prisma[this.model] as any).count({
      where,
    });
    return count > 0;
  }
}
