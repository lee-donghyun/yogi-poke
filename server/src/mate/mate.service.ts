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

    await this.db.poke.create({
      data: {
        realtionFromUserId: fromUserId,
        realtionToUserId: toUserId,
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
            realtionFromUserId: userId,
          },
          {
            realtionToUserId: userId,
          },
        ],
      },
      select: {
        id: true,
        createdAt: true,
        realtionFromUserId: true,
        realtionToUserId: true,
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
            realtionFromUserId: userId1,
            realtionToUserId: userId2,
          },
          {
            realtionFromUserId: userId2,
            realtionToUserId: userId1,
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
        realtionFromUserId: fromUserId,
        realtionToUserId: toUserId,
      },
    });
  }
}
