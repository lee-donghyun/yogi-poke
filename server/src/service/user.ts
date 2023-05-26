import { CLIENT_ERROR_MESSAGE } from '../helper/enum';
import { db } from '../repository/prisma';
import { createError } from '../utils/error';

const isUsedEmail = (email: string) =>
  db.user
    .findFirst({
      where: { email },
    })
    .then((res) => res !== null);

export const passwordMatchesEmail = (user: {
  email: string;
  password: string;
}) => db.user.findFirst({ where: user }).then((res) => res !== null);

export const registerUser = async (user: {
  email: string;
  password: string;
  name: string;
}) => {
  if (await isUsedEmail(user.email)) {
    throw createError({
      statusCode: 409,
      message: CLIENT_ERROR_MESSAGE.ALREADY_USED_EMAIL,
    });
  }
  const { id, email, name } = await db.user.create({ data: user });
  return { id, email, name };
};

export const getUser = async (user: { email: string }) => {
  const found = await db.user.findFirst({ where: user });
  if (found === null) {
    throw createError({
      statusCode: 400,
      message: CLIENT_ERROR_MESSAGE.NOT_FOUND,
    });
  }
  return found;
};

export const getUserByEmailAndPassword = async (user: {
  email: string;
  password: string;
}) => {
  if (await passwordMatchesEmail(user)) {
    const { email, id, name } = await getUser(user);
    return { email, id, name };
  }
  throw createError({
    statusCode: 400,
    message: CLIENT_ERROR_MESSAGE.NOT_FOUND,
  });
};

export const patchUser = async ({
  id,
  name,
  pushSubscription,
}: {
  id: number;
  name?: string;
  pushSubscription?: PushSubscriptionJSON;
}) => {
  db.user.update({
    where: {
      id,
    },
    data: {
      name,
      pushSubscription: JSON.stringify(pushSubscription),
    },
  });
};
