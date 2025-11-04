// This file helps TypeScript understand Node.js global objects like 'process'

// This tells TypeScript that we're in a Node.js environment
declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN?: string;
    BCRYPT_ROUNDS?: string;
    DATABASE_URL: string;
  }
}

// This makes the file a module
export {};
