import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { type PushSubscription, sendNotification } from 'web-push';

@Injectable()
export class PushService {
  static readonly NOTIFICATION_OPTION = {
    vapidDetails: {
      privateKey: process.env.VAPID_PRIVATE_KEY,
      publicKey: process.env.VAPID_PUBLIC_KEY,
      subject: process.env.VAPID_SUBJECT,
    },
  };
  constructor(private db: PrismaService) {}
  async sendPushNotification(
    userId: number,
    payload: {
      data: {
        options: {
          body: string;
        };
        title: string;
      };
      type: 'POKE';
    },
  ) {
    const user = await this.db.activeUser.findUnique({
      where: { id: userId },
    });
    if (!user?.pushSubscription) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    try {
      await sendNotification(
        JSON.parse(user.pushSubscription as string) as PushSubscription,
        JSON.stringify(payload),
        PushService.NOTIFICATION_OPTION,
      );
      return true;
    } catch (error: unknown) {
      console.log({ error });
      return false;
    }
  }
}
