import * as dotenv from 'dotenv';

dotenv.config();

// ProcessEnv types are now imported from src/types/env.d.ts

export const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000;
export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'your-256-bit-secret';
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';
export const BCRYPT_ROUNDS: number = process.env.BCRYPT_ROUNDS ? Number(process.env.BCRYPT_ROUNDS) : 12;
export const DATABASE_URL: string = process.env.DATABASE_URL || 'mysql://root:123456789@localhost:3306/shopscore';