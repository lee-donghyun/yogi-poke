import { createUserToken } from './auth';

export const registerUser = async (user: { id: string; password: string }) => {
  return createUserToken(1);
};
