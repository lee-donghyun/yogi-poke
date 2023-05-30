import { CLIENT_ERROR_MESSAGE } from '../helper/enum';
import { Pagination } from '../helper/type';
import { db } from '../repository/prisma';
import { createError } from '../utils/error';

const getRelation = async (fromUserId: number, toUserId: number) => {
  const relation = await db.relation.findUnique({
    where: {
      fromUserId_toUserId: { fromUserId, toUserId },
    },
  });
  return relation;
};

export const createRelation = async (fromUserId: number, toUserId: number) => {
  const relation = await getRelation(fromUserId, toUserId);
  if (relation !== null) {
    throw createError({
      statusCode: 409,
      message: CLIENT_ERROR_MESSAGE.ALREADY_HAS_RELATION,
    });
  }
  const made = await db.relation.create({ data: { fromUserId, toUserId } });
  return made;
};

export const assertHasAcceptedRelation = async (
  fromUserId: number,
  toUserId: number
) => {
  const relation = await getRelation(fromUserId, toUserId);
  if (relation === null || !relation.isAccepted) {
    throw createError({
      statusCode: 404,
      message: CLIENT_ERROR_MESSAGE.NOT_FOUND,
    });
  }
};

export const pokeMate = async (fromUserId: number, toUserId: number) => {
  await assertHasAcceptedRelation(fromUserId, toUserId);
  await db.poke.create({
    data: {
      realtionFromUserId: fromUserId,
      realtionToUserId: toUserId,
    },
  });
};

export const getPokedCount = async ({
  fromUserId,
  toUserId,
}: {
  fromUserId?: number;
  toUserId?: number;
}) => {
  return db.poke.count({
    where: { realtionFromUserId: fromUserId, realtionToUserId: toUserId },
  });
};

export const getPokedList = async (
  {
    fromUserId,
    toUserId,
  }: {
    fromUserId?: number;
    toUserId?: number;
  },
  { limit, page }: Pagination
) => {
  return db.poke.findMany({
    skip: limit * (page - 1),
    take: limit,
    orderBy: { createdAt: 'desc' },
    where: {
      realtionFromUserId: fromUserId,
      realtionToUserId: toUserId,
    },
  });
};

export const getRelatedPokesList = async (
  userId: number,
  { limit, page }: Pagination
) => {
  return db.poke.findMany({
    skip: limit * (page - 1),
    take: limit,
    orderBy: { createdAt: 'desc' },
    where: {
      OR: [
        {
          realtionFromUserId: userId,
        },
        {
          realtionToUserId: userId,
        },
      ],
    },
  });
};
