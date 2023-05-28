import { CLIENT_ERROR_MESSAGE } from '../helper/enum';

export class Error2 extends Error {
  public message: string;
  public statusCode: number;
  constructor(error: { statusCode: number; message: string }) {
    super(error.message);
    this.message = error.message;
    this.statusCode = error.statusCode;
  }
}

export const createError = (error: {
  statusCode: number;
  message: CLIENT_ERROR_MESSAGE;
}) => new Error2(error);
