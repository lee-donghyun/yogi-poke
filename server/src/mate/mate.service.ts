import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateUtilService } from 'src/util/date-util/date-util.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pagination } from './mate.interface';
import { RelationService } from 'src/relation/relation.service';

@Injectable()
export class MateService {
  constructor(
    private db: PrismaService,
    private dateUtilService: DateUtilService,
    private relationService: RelationService,
  ) {}

  async pokeMate(fromUserId: number, toUserId: number, payload: object) {
    const relation =
      (await this.relationService.getRelation(fromUserId, toUserId)) ??
      (await this.relationService.createRelation(fromUserId, toUserId));

    if (relation?.isAccepted === false) {
      throw new HttpException('차단한 사용자입니다.', HttpStatus.FORBIDDEN);
    }

    const reverseRelation =
      (await this.relationService.getRelation(toUserId, fromUserId)) ??
      (await this.relationService.createRelation(toUserId, fromUserId));

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
        payload: true,
        createdAt: true,
        fromUserId: true,
        toUserId: true,
        relation: {
          select: {
            fromUser: {
              select: {
                email: true,
                id: true,
                name: true,
                profileImageUrl: true,
                authProvider: true,
              },
            },
            toUser: {
              select: {
                email: true,
                id: true,
                name: true,
                profileImageUrl: true,
                authProvider: true,
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
      where: {
        AND: [
          typeof fromUserId == 'number' && {
            fromUserId,
            relation: { isAccepted: true },
          },
          typeof toUserId == 'number' && {
            toUserId,
            reverseRelation: { isAccepted: true },
          },
        ].filter(Boolean),
      },
    });
  }

  async getPokeCount(userId: number) {
    return this.db.poke.count({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
    });
  }
}
