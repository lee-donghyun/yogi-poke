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

  async pokeMate(fromUserId: number, toUserId: number, payload: object) {
    const relation =
      (await this.getRelation(fromUserId, toUserId)) ??
      (await this.createRelation(fromUserId, toUserId));

    if (relation?.isAccepted === false) {
      throw new HttpException('차단한 사용자입니다.', HttpStatus.FORBIDDEN);
    }

    const reverseRelation =
      (await this.getRelation(toUserId, fromUserId)) ??
      (await this.createRelation(toUserId, fromUserId));

    if (reverseRelation?.isAccepted === false) {
      throw new HttpException('차단당한 사용자입니다.', HttpStatus.FORBIDDEN);
    }

    if (
      await this.db.poke
        .findFirst({
          where: {
            OR: [
              { fromUserId, toUserId },
              { toUserId: fromUserId, fromUserId: toUserId },
            ],
          },
          orderBy: [{ id: 'desc' }],
        })
        .then(
          (row) =>
            row?.fromUserId === fromUserId &&
            this.dateUtilService.getDiffDays(row.createdAt, Date.now()) < 1,
        )
    ) {
      throw new HttpException('Already poked', HttpStatus.CONFLICT);
    }

    await this.db.poke.create({
      data: {
        fromUserId,
        toUserId,
        payload,
        relationId: relation.id,
        reverseRelationId: reverseRelation.id,
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
            fromUserId: userId,
            relation: { isAccepted: true },
          },
          {
            toUserId: userId,
            reverseRelation: { isAccepted: true },
          },
        ],
      },
      select: {
        id: true,
        createdAt: true,
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

  async getUserRelatedPokeList(
    userId1: number,
    userId2: number,
    { limit, page }: Pagination,
  ) {
    return this.db.poke.findMany({
      skip: limit * (page - 1),
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: {
        OR: [
          {
            fromUserId: userId1,
            toUserId: userId2,
          },
          {
            fromUserId: userId2,
            toUserId: userId1,
          },
        ],
      },
    });
  }

  async getPokedCount({
    fromUserId,
    toUserId,
  }: {
    fromUserId?: number;
    toUserId?: number;
  }) {
    return this.db.poke.count({
      where: { fromUserId, toUserId },
    });
  }
}
