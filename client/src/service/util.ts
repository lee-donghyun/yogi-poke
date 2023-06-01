import dayjs from "dayjs";

export const getReadableDateOffset = (date: string) => {
  const now = dayjs();
  const then = dayjs(date);

  const diffDays = now.diff(then, "day");

  if (diffDays === 0) {
    return "오늘";
  }
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }
  if (now.diff(then, "year") < 1) {
    return then.format("M/D");
  }
  return then.format("Y M/D");
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
    "/worker/notification.js"
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
