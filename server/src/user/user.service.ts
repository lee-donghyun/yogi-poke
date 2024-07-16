import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pagination } from './user.interface';
import { compare, hash } from 'bcrypt';
import { AuthProvider, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}
  async getUser(
    user: { email: string } | { authProvider: AuthProvider; authId: string },
  ) {
    const found = await this.db.activeUser.findFirst({
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

  async registerUser(
    user:
      | {
          type: typeof AuthProvider.EMAIL;
          email: string;
          password: string;
          name: string;
          referrerId?: number;
        }
      | {
          type: typeof AuthProvider.INSTAGRAM;
          email: string;
          name: string;
          referrerId?: number;
        },
  ) {
    if (await this.isUsedEmail(user.email)) {
      throw new HttpException('Already Used Email', HttpStatus.CONFLICT);
    }

    const isValidReferrerId = user.referrerId
      ? await this.db.activeUser.findFirst({
          where: { id: user.referrerId },
        })
      : null;

    const password =
      user.type === AuthProvider.EMAIL ? user.password : randomUUID();

    const encryptedPassword = await hash(password, 10);

    return this.db.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: encryptedPassword,
        referrerId: isValidReferrerId?.id,
      },
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
    const found = await this.db.activeUser.findFirst({
      where: { email: user.email },
    });
    if (found === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const isValidPassword = await compare(user.password, found.password);
    if (!isValidPassword) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return found;
  }

  async patchUser({
    id,
    name,
    pushSubscription,
    profileImageUrl,
  }: {
    id: number;
    password?: string;
    name?: string;
    pushSubscription?: PushSubscriptionJSON | null;
    profileImageUrl?: string;
  }) {
    return this.db.user.update({
      where: {
        id,
      },
      data: {
        name,
        pushSubscription:
          pushSubscription === null
            ? Prisma.DbNull
            : pushSubscription === undefined
            ? undefined
            : JSON.stringify(pushSubscription),
        profileImageUrl,
      },
    });
  }

  async getUserList(
    { email, ids, name }: { email?: string; ids?: number[]; name?: string },
    { limit, page }: Pagination,
    orderBy: Prisma.SortOrder,
    selfId: number,
  ) {
    return this.db.activeUser.findMany({
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
              {
                name: {
                  contains: name,
                },
              },
            ],
          },
          {
            NOT: { id: selfId },
          },
          {
            NOT: {
              comingRelations: {
                some: { fromUserId: selfId, isAccepted: false },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImageUrl: true,
      },
      orderBy: { id: orderBy },
    });
  }

  async deleteUser(id: number) {
    return this.db.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
