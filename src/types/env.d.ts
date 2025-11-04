namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    BCRYPT_ROUNDS: string;
    DATABASE_URL: string;
  }
}