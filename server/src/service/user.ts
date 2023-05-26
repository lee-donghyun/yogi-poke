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
  const { id, email } = await db.user.create({ data: user });
  return { id, email };
};

export const getUserByEmailAndPassword = async (user: {
  email: string;
  password: string;
}) => {
  const found = await db.user.findFirst({ where: user });
  if (found === null) {
    throw createError({
      statusCode: 400,
      message: CLIENT_ERROR_MESSAGE.NOT_FOUND,
    });
  }
  return {
    id: found.id,
    email: found.email,
  };
};
