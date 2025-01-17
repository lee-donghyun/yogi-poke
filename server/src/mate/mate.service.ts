import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RelationService } from 'src/relation/relation.service';
import { DateUtilService } from 'src/util/date-util/date-util.service';

import { Pagination } from './mate.interface';

@Injectable()
export class MateService {
  constructor(
    private db: PrismaService,
    private dateUtilService: DateUtilService,
    private relationService: RelationService,
  ) {}

  async getPokeCount(userId: number) {
    return this.db.poke.count({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
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
            reverseRelation: { isAccepted: true },
            toUserId,
          },
        ].filter(Boolean),
      },
    });
  }

  async getRelatedPokesList(userId: number, { limit, page }: Pagination) {
    return this.db.poke.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        createdAt: true,
        fromUserId: true,
        id: true,
        payload: true,
        relation: {
          select: {
            fromUser: {
              select: {
                authProvider: true,
                email: true,
                id: true,
                name: true,
                profileImageUrl: true,
              },
            },
            toUser: {
              select: {
                authProvider: true,
                email: true,
                id: true,
                name: true,
                profileImageUrl: true,
              },
            },
          },
        },
        toUserId: true,
      },
      skip: limit * (page - 1),
      take: limit,
      where: {
        OR: [
          {
            fromUserId: userId,
            relation: { isAccepted: true },
          },
          {
            reverseRelation: { isAccepted: true },
            toUserId: userId,
          },
        ],
      },
    });
  }

  async getUserRelatedPokeList(
    userId1: number,
    userId2: number,
    { limit, page }: Pagination,
  ) {
    return this.db.poke.findMany({
      orderBy: { createdAt: 'desc' },
      skip: limit * (page - 1),
      take: limit,
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
          orderBy: [{ id: 'desc' }],
          where: {
            OR: [
              { fromUserId, toUserId },
              { fromUserId: toUserId, toUserId: fromUserId },
            ],
          },
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
        payload,
        relationId: relation.id,
        reverseRelationId: reverseRelation.id,
        toUserId,
      },
    });
  }
}
