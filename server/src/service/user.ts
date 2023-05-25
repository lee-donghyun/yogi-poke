import { CLIENT_ERROR_MESSAGE } from '../helper/enum';
import { db } from '../repository/prisma';

export const isUsedEmail = (email: string) =>
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
    throw { code: 409, message: CLIENT_ERROR_MESSAGE.ALREADY_USED_EMAIL };
  }
  return db.user.create({ data: user });
};
