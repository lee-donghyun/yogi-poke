import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthProvider, Prisma } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { JwtPayload } from 'src/auth/auth.interface';
import { PrismaService } from 'src/prisma/prisma.service';

import { Pagination } from './user.interface';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}
  async deleteUser(id: number) {
    return this.db.user.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
  }
  async getUser(
    user:
      | { authProvider: AuthProvider; authProviderId: string }
      | { email: string },
  ): Promise<JwtPayload> {
    const found = await this.db.activeUser.findFirst({
      select: {
        authProvider: true,
        createdAt: true,
        email: true,
        id: true,
        name: true,
        profileImageUrl: true,
        pushSubscription: true,
      },
      where: user,
    });
    if (found === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return found;
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

  async getUserList(
    {
      email,
      ids,
      isFollowing,
      name,
    }: {
      email?: string;
      ids?: number[];
      isFollowing?: boolean;
      name?: string;
    },
    { limit, page }: Pagination,
    orderBy: Prisma.SortOrder,
    selfId: number,
  ) {
    return this.db.activeUser.findMany({
      orderBy: { id: orderBy },
      select: {
        authProvider: true,
        email: true,
        id: true,
        name: true,
        profileImageUrl: true,
      },
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
          ...(typeof isFollowing === 'boolean'
            ? [
                {
                  comingRelations: {
                    some: { fromUserId: selfId, isFollowing },
                  },
                },
              ]
            : []),
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
    });
  }

  async isUsedEmail(email: string) {
    return this.db.user
      .findFirst({
        where: { email },
      })
      .then((res) => res !== null);
  }

  async patchUser({
    id,
    name,
    profileImageUrl,
    pushSubscription,
  }: {
    id: number;
    name?: string;
    password?: string;
    profileImageUrl?: string;
    pushSubscription?: null | PushSubscriptionJSON;
  }) {
    return this.db.user.update({
      data: {
        name,
        profileImageUrl,
        pushSubscription:
          pushSubscription === null
            ? Prisma.DbNull
            : pushSubscription === undefined
              ? undefined
              : JSON.stringify(pushSubscription),
      },
      where: {
        id,
      },
    });
  }

  async registerUser(
    user:
      | {
          authProviderId: string;
          email: string;
          name: string;
          referrerId?: number;
          type: typeof AuthProvider.INSTAGRAM;
        }
      | {
          email: string;
          name: string;
          password: string;
          referrerId?: number;
          type: typeof AuthProvider.EMAIL;
        },
  ): Promise<JwtPayload> {
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
        authProvider: user.type,
        authProviderId:
          user.type === AuthProvider.INSTAGRAM ? user.authProviderId : null,
        email: user.email,
        name: user.name,
        password: encryptedPassword,
        referrerId: isValidReferrerId?.id,
      },
      select: {
        authProvider: true,
        createdAt: true,
        email: true,
        id: true,
        name: true,
        profileImageUrl: true,
        pushSubscription: true,
      },
    });
  }
}
