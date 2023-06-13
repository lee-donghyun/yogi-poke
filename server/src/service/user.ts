import { Prisma } from '@prisma/client';
import { CLIENT_ERROR_MESSAGE } from '../helper/enum';
import { Pagination } from '../helper/type';
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
  return db.user.create({
    data: user,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      profileImageUrl: true,
      pushSubscription: true,
    },
  });
};

export const getUser = async (user: { email: string }) => {
  const found = await db.user.findFirst({
    where: user,
    select: {
      createdAt: true,
      email: true,
      id: true,
      name: true,
      profileImageUrl: true,
      pushSubscription: true,
    },
  });
  if (found === null) {
    throw createError({
      statusCode: 404,
      message: CLIENT_ERROR_MESSAGE.NOT_FOUND,
    });
  }
  return found;
};

export const getUserByEmailAndPassword = async (data: {
  email: string;
  password: string;
}) => {
  if (await passwordMatchesEmail(data)) {
    const user = await getUser(data);
    return user;
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
  profileImageUrl,
}: {
  id: number;
  password?: string;
  name?: string;
  pushSubscription?: PushSubscriptionJSON | null;
  profileImageUrl?: string;
}) => {
  return db.user.update({
    where: {
      id,
    },
    data: {
      name,
      pushSubscription:
        pushSubscription === null
          ? Prisma.DbNull
          : pushSubscription === undefined
          ? undefined
          : JSON.stringify(pushSubscription),
      profileImageUrl,
    },
  });
};

export const getUserList = (
  { email, ids }: { email?: string; ids?: number[] },
  { limit, page }: Pagination,
  selfId?: number
) => {
  return db.user.findMany({
    skip: limit * (page - 1),
    take: limit,
    where: {
      AND: [
        {
          OR: [
            {
              email: {
                startsWith: email,
              },
            },
            {
              id: {
                in: ids ?? [],
              },
            },
          ],
        },
        {
          NOT: { id: selfId },
        },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      profileImageUrl: true,
    },
  });
};
