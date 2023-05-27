import * as webPush from 'web-push';
import { CLIENT_ERROR_MESSAGE } from '../helper/enum';
import { db } from '../repository/prisma';
import { createError } from '../utils/error';

const NOTIFICATION_OPTION = {
  vapidDetails: {
    subject: process.env.VAPID_SUBJECT as string,
    publicKey: process.env.VAPID_PUBLIC_KEY as string,
    privateKey: process.env.VAPID_PRIVATE_KEY as string,
  },
};

export const sendPushNotification = async (
  userId: number,
  payload: {
    title: string;
    body: string;
  }
) => {
  const user = await db.user.findFirst({ where: { id: userId } });
  if (user?.pushSubscription === undefined) {
    throw createError({
      statusCode: 404,
      message: CLIENT_ERROR_MESSAGE.NOT_FOUND,
    });
  }

  return webPush.sendNotification(
    JSON.parse(user.pushSubscription as string),
    JSON.stringify(payload),
    NOTIFICATION_OPTION
  );
};
