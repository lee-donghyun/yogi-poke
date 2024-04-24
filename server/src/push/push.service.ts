import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as webPush from 'web-push';

@Injectable()
export class PushService {
  static readonly NOTIFICATION_OPTION = {
    vapidDetails: {
      subject: process.env.VAPID_SUBJECT as string,
      publicKey: process.env.VAPID_PUBLIC_KEY as string,
      privateKey: process.env.VAPID_PRIVATE_KEY as string,
    },
  };
  constructor(private db: PrismaService) {}
  async sendPushNotification(
    userId: number,
    payload: {
      title: string;
      body: string;
    },
  ) {
    const user = await this.db.user.findFirst({ where: { id: userId } });
    if (user?.pushSubscription === undefined) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return webPush.sendNotification(
      JSON.parse(user.pushSubscription as string),
      JSON.stringify(payload),
      PushService.NOTIFICATION_OPTION,
    );
  }
}
