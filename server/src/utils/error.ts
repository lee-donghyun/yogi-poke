import { CLIENT_ERROR_MESSAGE } from '../helper/enum';

export const createError = (error: {
  statusCode: number;
  message: CLIENT_ERROR_MESSAGE;
}) => error;
