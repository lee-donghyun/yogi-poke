import dayjs from "dayjs";

import type { Line } from "../ui/base/Canvas";

import { AuthProvider, User } from "./dataType";

export const getReadableDateOffset = (date: string) => {
  const now = dayjs();
  const then = dayjs(date);

  if (now.diff(then, "hour") < 1) {
    return `${now.diff(then, "minute") + 1}분 전`;
  }
  if (now.diff(then, "day") < 1) {
    return `${now.diff(then, "hour") + 1}시간 전`;
  }
  if (now.diff(then, "week") < 1) {
    return `${now.diff(then, "day") + 1}일 전`;
  }
  if (now.diff(then, "year") < 1) {
    return then.format("M월 D일");
  }
  return then.format("Y년 M월 D일");
};

export const getPushNotificationSubscription = async () => {
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
  if (Notification.permission !== "granted") {
    throw new Error(`permission not granted: ${Notification.permission}`);
  }

  const registration = await navigator.serviceWorker.register(
    "/worker/notification.js",
  );

  if (registration.installing) {
    const { promise, resolve } = Promise.withResolvers<PushSubscription>();
    registration.installing.addEventListener(
      "statechange",
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (e) => {
        if ((e.target as ServiceWorker)?.state == "activated") {
          const pushSubscription = await registration.pushManager.subscribe({
            applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
            userVisibleOnly: true,
          });
          resolve(pushSubscription);
        }
      },
      { once: true },
    );
    return promise;
  }

  if (registration.active) {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription === null) {
      throw new Error("구독 실패");
    }
    return subscription;
  }

  throw new Error("worker not found");
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const getDistance = (
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) => {
  const deg2rad = (deg: number) => deg * (Math.PI / 180);
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(b.latitude - a.latitude);
  const dLon = deg2rad(b.longitude - a.longitude);
  const A =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(a.latitude)) *
      Math.cos(deg2rad(b.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
  return R * C;
};
export const isVerifiedUser = (user: User) =>
  [AuthProvider.INSTAGRAM].includes(user.authProvider);

export const getNormalizedPoints = (size: number) => (lines: Line[]) =>
  lines.map((line) => ({
    ...line,
    points: line.points.map((point) => Math.round((point * 1000) / size)),
  }));

export const getDenormalizedPoints = (size: number) => (lines: Line[]) =>
  lines.map((line) => ({
    ...line,
    points: line.points.map((point) => (point * size) / 1000),
  }));
