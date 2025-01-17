import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { sendNotification } from 'web-push';

@Injectable()
export class PushService {
  static readonly NOTIFICATION_OPTION = {
    vapidDetails: {
      subject: process.env.VAPID_SUBJECT!,
      publicKey: process.env.VAPID_PUBLIC_KEY!,
      privateKey: process.env.VAPID_PRIVATE_KEY!,
    },
  };
  constructor(private db: PrismaService) {}
  async sendPushNotification(
    userId: number,
    payload: {
      type: 'POKE';
      data: {
        title: string;
        options: {
          body: string;
        };
      };
    },
  ) {
    const user = await this.db.activeUser.findFirst({ where: { id: userId } });
    if (user?.pushSubscription === undefined) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    try {
      await sendNotification(
        JSON.parse(user.pushSubscription as string),
        JSON.stringify(payload),
        PushService.NOTIFICATION_OPTION,
      );
      return true;
    } catch (error) {
      console.log({ error });

      return false;
    }
  }
}
