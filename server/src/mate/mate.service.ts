import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateUtilService } from 'src/util/date-util/date-util.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pagination } from './mate.interface';

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

  async pokeMate(fromUserId: number, toUserId: number, payload: object) {
    const fromRelation = await this.getRelation(fromUserId, toUserId);
    if (fromRelation?.isAccepted === false) {
      throw new HttpException('차단한 사용자입니다.', HttpStatus.FORBIDDEN);
    }
    if (fromRelation?.isAccepted === undefined) {
      await this.createRelation(fromUserId, toUserId);
    }

    const toRelation = await this.getRelation(toUserId, fromUserId);
    if (toRelation?.isAccepted === false) {
      throw new HttpException('차단당한 사용자입니다.', HttpStatus.FORBIDDEN);
    }

    if (
      await this.db.poke
        .findFirst({
          where: {
            OR: [
              { relationFromUserId: fromUserId, relationToUserId: toUserId },
              { relationFromUserId: toUserId, relationToUserId: fromUserId },
            ],
          },
          orderBy: [{ id: 'desc' }],
        })
        .then(
          (row) =>
            row?.relationFromUserId === fromUserId &&
            this.dateUtilService.getDiffDays(row.createdAt, Date.now()) < 1,
        )
    ) {
      throw new HttpException('Already poked', HttpStatus.CONFLICT);
    }

    await this.db.poke.create({
      data: {
        relationFromUserId: fromUserId,
        relationToUserId: toUserId,
        payload,
      },
    });
  }

  async getRelatedPokesList(userId: number, { limit, page }: Pagination) {
    return this.db.poke.findMany({
      skip: limit * (page - 1),
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: {
        OR: [
          {
            relationFromUserId: userId,
          },
          {
            relationToUserId: userId,
          },
        ],
      },
      select: {
        id: true,
        createdAt: true,
        relationFromUserId: true,
        relationToUserId: true,
        payload: true,
        relation: {
          select: {
            fromUser: {
              select: {
                email: true,
                id: true,
                name: true,
                profileImageUrl: true,
              },
            },
            toUser: {
              select: {
                email: true,
                id: true,
                name: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  getUserRelatedPokeList = async (
    userId1: number,
    userId2: number,
    { limit, page }: Pagination,
  ) => {
    return this.db.poke.findMany({
      skip: limit * (page - 1),
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: {
        OR: [
          {
            relationFromUserId: userId1,
            relationToUserId: userId2,
          },
          {
            relationFromUserId: userId2,
            relationToUserId: userId1,
          },
        ],
      },
    });
  };

  async getPokedCount({
    fromUserId,
    toUserId,
  }: {
    fromUserId?: number;
    toUserId?: number;
  }) {
    return this.db.poke.count({
      where: {
        relationFromUserId: fromUserId,
        relationToUserId: toUserId,
      },
    });
  }
}
