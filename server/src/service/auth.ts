import { sign, verify } from 'jsonwebtoken';
import { CLIENT_ERROR_MESSAGE } from '../helper/enum';
import { createError } from '../utils/error';

const jwtSecret = process.env.JWT_SECRET || '';

export const createUserToken = async (userId: number) => {
  return sign({ userId }, jwtSecret);
};

export const verifyUserToken = (token: string) => {
  try {
    return verify(token, jwtSecret) as { userId: number };
  } catch {
    throw createError({
      statusCode: 401,
      message: CLIENT_ERROR_MESSAGE.INVALID_TOKEN,
    });
  }
};
