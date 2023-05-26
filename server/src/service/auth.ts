import { sign, verify } from 'jsonwebtoken';
import { CLIENT_ERROR_MESSAGE } from '../helper/enum';
import { createError } from '../utils/error';

const jwtSecret = process.env.JWT_SECRET || '';

export const createUserToken = async (user: JwtPayload) => {
  return sign(user, jwtSecret);
};

export const verifyUserToken = (token: string) => {
  try {
    return verify(token, jwtSecret) as JwtPayload;
  } catch {
    throw createError({
      statusCode: 401,
      message: CLIENT_ERROR_MESSAGE.INVALID_TOKEN,
    });
  }
};

export type JwtPayload = { id: number; email: string };
