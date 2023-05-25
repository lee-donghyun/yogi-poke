import { CLIENT_ERROR_MESSAGE } from '../helper/enum';
import { db } from '../repository/prisma';
import { createError } from '../utils/error';

const isUsedEmail = (email: string) =>
  db.user
    .findFirst({
      where: { email },
    })
    .then((res) => res !== null);

export const registerUser = async (user: {
  email: string;
  password: string;
}) => {
  if (await isUsedEmail(user.email)) {
    throw createError({
      statusCode: 409,
      message: CLIENT_ERROR_MESSAGE.ALREADY_USED_EMAIL,
    });
  }
  return db.user.create({ data: user });
};

export const getUser = async (user: { id: number }) => {
  const found = await db.user.findUnique({ where: user });
  if (found === null) {
    throw createError({
      statusCode: 404,
      message: CLIENT_ERROR_MESSAGE.NOT_FOUND,
    });
  }
  return found;
};
