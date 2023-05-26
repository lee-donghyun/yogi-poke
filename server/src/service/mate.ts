import { CLIENT_ERROR_MESSAGE } from '../helper/enum';
import { db } from '../repository/prisma';
import { createError } from '../utils/error';

export const getRelation = async (fromUserId: number, toUserId: number) => {
  const relation = await db.relation.findUnique({
    where: {
      fromUserId_toUserId: { fromUserId, toUserId },
    },
  });
  return relation;
};

export const createRelation = async (fromUserId: number, toUserId: number) => {
  const made = await db.relation.create({ data: { fromUserId, toUserId } });
  return made;
};
