import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
