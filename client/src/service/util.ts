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

  void navigator.serviceWorker.register("/worker/notification.js");

  const worker = await navigator.serviceWorker.ready;

  const subscription = await worker.pushManager.subscribe({
    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    userVisibleOnly: true,
  });

  return subscription;
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
