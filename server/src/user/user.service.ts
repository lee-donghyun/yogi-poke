import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pagination } from './user.interface';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}
  async getUser(user: { email: string }) {
    const found = await this.db.user.findFirst({
      where: user,
      select: {
        createdAt: true,
        email: true,
        id: true,
        name: true,
        profileImageUrl: true,
        pushSubscription: true,
      },
    });
    if (found === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return found;
  }
  async isUsedEmail(email: string) {
    return this.db.user
      .findFirst({
        where: { email },
      })
      .then((res) => res !== null);
  }
  async registerUser(user: {
    email: string;
    password: string;
    name: string;
    referrerId?: number;
  }) {
    if (await this.isUsedEmail(user.email)) {
      throw new HttpException('Already Used Email', HttpStatus.CONFLICT);
    }
    const isValidReferrerId = user.referrerId
      ? await this.db.user.findFirst({
          where: { id: user.referrerId },
        })
      : null;
    return this.db.user.create({
      data: { ...user, referrerId: isValidReferrerId?.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        profileImageUrl: true,
        pushSubscription: true,
      },
    });
  }

  async getUserByEmailAndPassword(user: { email: string; password: string }) {
    const found = await this.db.user.findFirst({ where: user });
    if (found === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return found;
  }

  async patchUser(user: {
    id: number;
    name?: string;
    password?: string;
    profileImageUrl?: string;
    pushSubscription?: string;
  }) {
    const updated = await this.db.user.update({
      where: { id: user.id },
      data: user,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        profileImageUrl: true,
        pushSubscription: true,
      },
    });
    return updated;
  }

  async getUserList(
    { email, ids }: { email?: string; ids?: number[] },
    { limit, page }: Pagination,
    selfId?: number,
  ) {
    return this.db.user.findMany({
      skip: limit * (page - 1),
      take: limit,
      where: {
        AND: [
          {
            OR: [
              {
                email: {
                  startsWith: email,
                },
              },
              {
                id: {
                  in: ids ?? [],
                },
              },
            ],
          },
          {
            NOT: { id: selfId },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImageUrl: true,
      },
    });
  }
}
