import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RelationService {
  constructor(private db: PrismaService) {}
  async updateUserAcception(
    isAccepted: boolean,
    {
      fromUserId,
      toUserId,
    }: {
      fromUserId: number;
      toUserId: number;
    },
  ) {
    return this.db.relation.update({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
      data: { isAccepted },
    });
  }

  async getBlockedUsers(userId: number) {
    return this.db.relation
      .findMany({
        where: {
          fromUserId: userId,
          isAccepted: false,
        },
        select: {
          toUser: {
            select: {
              id: true,
              email: true,
              name: true,
              profileImageUrl: true,
            },
          },
        },
      })
      .then((relations) => relations.map((relation) => relation.toUser));
  }
}
