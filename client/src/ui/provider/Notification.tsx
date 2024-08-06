import {
  createContext,
  JSX,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";

import { noop } from "../../service/util";

interface NotificationData {
  content: string;
}

const notificationContext = createContext<
  [(notification: NotificationData) => void, () => void]
>([
  () => {
    throw new Error(
      "useNotification hook-domain need to be called in NotificationProvider",
    );
  },
  noop,
]);

export const useNotification = () => {
  const [push, init] = useContext(notificationContext);
  useEffect(init, [init]);
  return push;
};

const ToastProvider = lazy(() =>
  import("sonner").then((module) => ({ default: module.Toaster })),
);

export const NotificationProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [load, setLoad] = useState(false);

  const push = ({ content }: NotificationData) => {
    void import("sonner").then(({ toast }) =>
      toast("요기콕콕!", { description: content }),
    );
  };

  const init = !load
    ? () => {
        if (import.meta.env.DEV) {
          console.warn("NotificationProvider is initialized");
        }
        setLoad(true);
      }
    : noop;

  return (
    <notificationContext.Provider value={[push, init]}>
      {children}
      {load && (
        <Suspense>
          <ToastProvider closeButton position="top-center" />
        </Suspense>
      )}
    </notificationContext.Provider>
  );
};
