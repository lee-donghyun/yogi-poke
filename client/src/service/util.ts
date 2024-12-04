/* eslint-disable @typescript-eslint/no-misused-promises */
import dayjs from "dayjs";

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
  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error(`permission not granted: ${permission}`);
  }
  const registration = await navigator.serviceWorker.register(
    "/worker/notification.js",
  );

  return new Promise<PushSubscription>((res) => {
    if (registration.installing) {
      registration.installing.addEventListener("statechange", async (e) => {
        if (
          (e as unknown as { target: { state: string } }).target.state ==
          "activated"
        ) {
          const pushSubscription = await registration.pushManager.subscribe({
            applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
            userVisibleOnly: true,
          });
          res(pushSubscription);
        }
      });
    } else if (registration.active) {
      return registration.pushManager.getSubscription().then((subscription) => {
        if (subscription === null) {
          throw new Error("구독 실패");
        }
        res(subscription);
      });
    }
  });
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
