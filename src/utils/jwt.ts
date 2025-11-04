import jwt, { JwtPayload } from 'jsonwebtoken';

type UserPayload = {
  id: string;
  role: string;
};

export const signToken = (user: UserPayload): string => {
  const payload: JwtPayload = {
    id: user.id,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): UserPayload => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return {
      id: decoded.id as string,
      role: decoded.role as string,
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
