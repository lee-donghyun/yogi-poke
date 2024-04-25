import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateUtilService } from 'src/util/date-util/date-util.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MateService {
  constructor(
    private db: PrismaService,
    private dateUtilService: DateUtilService,
  ) {}
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

  async pokeMate(fromUserId: number, toUserId: number) {
    const relation = await this.getRelation(fromUserId, toUserId);
    if (relation?.isAccepted === false) {
      throw new HttpException('Blocked relation', HttpStatus.FORBIDDEN);
    } else if (relation?.isAccepted === undefined) {
      await this.createRelation(fromUserId, toUserId);
    } else {
      if (
        await this.db.poke
          .findFirst({
            where: {
              OR: [
                { realtionFromUserId: fromUserId, realtionToUserId: toUserId },
                { realtionFromUserId: toUserId, realtionToUserId: fromUserId },
              ],
            },
            orderBy: [{ id: 'desc' }],
          })
          .then(
            (row) =>
              row?.realtionFromUserId === fromUserId &&
              this.dateUtilService.getDiffDays(row.createdAt, Date.now()) < 1,
          )
      ) {
        throw new HttpException('Already poked', HttpStatus.CONFLICT);
      }
    }

    await this.db.poke.create({
      data: {
        realtionFromUserId: fromUserId,
        realtionToUserId: toUserId,
      },
    });
  }
}
