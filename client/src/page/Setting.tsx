// getPushNotificationSubscription()
//   .then((pushSubscription) => patchUser({ pushSubscription }))
//   .then(() =>
//     push({ content: "이제 콕 찔리면 알림이 울립니다." })
//   )
//   .catch(console.error);

import { StackedNavigation } from "../component/Navigation";

const BellIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const Setting = () => {
  return (
    <div className="min-h-screen">
      <StackedNavigation onBack={() => history.back()} title="설정" />
      <div className="p-5 pt-10">
        <h4>알림</h4>
        <div className="flex justify-between">
          <p>푸시 알림</p>
        </div>
      </div>
    </div>
  );
};
