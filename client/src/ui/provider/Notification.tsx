import { useLingui } from "@lingui/react/macro";
import { createContext, JSX, useContext } from "react";
import { toast, Toaster } from "sonner";

interface NotificationData {
  content: string;
}

const notificationContext = createContext<
  (notification: NotificationData) => void
>(() => {
  throw new Error(
    "useNotification hook-domain need to be called in NotificationProvider",
  );
});

export const useNotification = () => useContext(notificationContext);

export const NotificationProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { t } = useLingui();
  const push = ({ content }: NotificationData) => {
    toast(t`요기콕콕!`, { description: content });
  };

  return (
    <notificationContext.Provider value={push}>
      {children}
      <Toaster closeButton position="top-center" />
    </notificationContext.Provider>
  );
};
