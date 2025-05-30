import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RelationService {
  constructor(private db: PrismaService) {}
  async getBlockedUsers(userId: number) {
    return this.db.relation
      .findMany({
        select: {
          toUser: {
            select: {
              email: true,
              id: true,
              name: true,
              profileImageUrl: true,
            },
          },
        },
        where: {
          fromUserId: userId,
          isAccepted: false,
        },
      })
      .then((relations) => relations.map((relation) => relation.toUser));
  }

  async getRelation(fromUserId: number, toUserId: number) {
    const relation =
      (await this.db.relation.findFirst({
        where: { fromUserId, toUserId },
      })) ?? (await this.createRelation(fromUserId, toUserId));
    return relation;
  }
  async updateUserRelation(
    {
      isAccepted,
      isFollowing,
    }: {
      isAccepted?: boolean;
      isFollowing?: boolean;
    },
    {
      fromUserId,
      toUserId,
    }: {
      fromUserId: number;
      toUserId: number;
    },
  ) {
    return this.db.relation.upsert({
      create: { fromUserId, isAccepted, isFollowing, toUserId },
      update: { isAccepted, isFollowing },
      where: {
        fromUserId_toUserId: { fromUserId, toUserId },
      },
    });
  }

  private async createRelation(fromUserId: number, toUserId: number) {
    return await this.db.relation.create({
      data: { fromUserId, toUserId },
    });
  }
}
