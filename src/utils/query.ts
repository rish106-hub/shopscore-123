import { Prisma } from '@prisma/client';

type SortOrder = 'asc' | 'desc';
type SortFields = Record<string, SortOrder>;

type PaginationOptions = {
  page?: number;
  limit?: number;
};

type SortOptions = {
  sort?: string;
};

type FilterOptions = {
  [key: string]: any;
};

export const getPagination = (options: PaginationOptions) => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const skip = (page - 1) * limit;

  return { take: limit, skip };
};

export const getPagingData = (
  data: { count: number; rows: any[] },
  page: number,
  limit: number
) => {
  const { count: totalItems, rows } = data;
  const currentPage = page || 1;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: rows,
    meta: {
      page: currentPage,
      limit,
      total: totalItems,
      pages: totalPages,
    },
  };
};

export const getSortOptions = (sortString?: string, allowedFields: string[] = []) => {
  if (!sortString) return {};

  const sortOptions: SortFields = {};
  const sorts = sortString.split(',');

  for (const sort of sorts) {
    const [field, direction] = sort.split(':');
    
    if (!field || !['asc', 'desc'].includes(direction?.toLowerCase())) continue;
    if (allowedFields.length > 0 && !allowedFields.includes(field)) continue;

    sortOptions[field] = direction.toLowerCase() as SortOrder;
  }

  return sortOptions;
};

export const getWhereOptions = (filters: FilterOptions) => {
  const where: any = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === '') continue;

    switch (key) {
      case 'q':
        where.OR = [
          { title: { contains: value, mode: 'insensitive' } },
          { description: { contains: value, mode: 'insensitive' } },
        ];
        break;
      case 'category':
        where.category = value;
        break;
      case 'priceMin':
        where.price = { gte: Number(value) };
        break;
      case 'priceMax':
        where.price = { ...where.price, lte: Number(value) };
        break;
      case 'ratingMin':
        where.avgRating = { gte: Number(value) };
        break;
      case 'createdBefore':
        where.createdAt = { lte: new Date(value) };
        break;
      case 'createdAfter':
        where.createdAt = { gte: new Date(value) };
        break;
      default:
        if (['id', 'title', 'slug', 'stock'].includes(key)) {
          where[key] = value;
        }
        break;
    }
  }

  return where;
};
