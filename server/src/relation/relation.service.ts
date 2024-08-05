import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RelationService {
  constructor(private db: PrismaService) {}
  async getRelation(fromUserId: number, toUserId: number) {
    const relation = await this.db.relation.findFirst({
      where: { fromUserId, toUserId },
    });
    return relation;
  }

  async createRelation(fromUserId: number, toUserId: number) {
    const relation = await this.getRelation(fromUserId, toUserId);
    if (relation !== null) {
      throw new HttpException('Already has relation', HttpStatus.CONFLICT);
    }
    const made = await this.db.relation.create({
      data: { fromUserId, toUserId },
    });
    return made;
  }
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
    return this.db.relation.upsert({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
      update: { isAccepted },
      create: { fromUserId, toUserId, isAccepted },
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
