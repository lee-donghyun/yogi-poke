import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MateService {
  constructor(private db: PrismaService) {}
  async getRelation(fromUserId: number, toUserId: number) {
    const relation = await this.db.relation.findUnique({
      where: {
        fromUserId_toUserId: { fromUserId, toUserId },
      },
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
}
