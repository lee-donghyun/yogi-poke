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
}
