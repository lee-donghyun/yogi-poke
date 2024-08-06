import {
  createContext,
  JSX,
  lazy,
  Suspense,
  useContext,
  useState,
} from "react";

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
  () => "",
]);

export const useNotification = () => {
  const [push, init] = useContext(notificationContext);
  init();
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
  return (
    <notificationContext.Provider
      value={[
        ({ content }) => {
          void import("sonner").then(({ toast }) =>
            toast("요기콕콕!", { description: content }),
          );
        },
        () => {
          if (!load) {
            if (import.meta.env.DEV) {
              console.warn("NotificationProvider is initialized");
            }
            setLoad(true);
          }
        },
      ]}
    >
      {children}
      {load && (
        <Suspense>
          <ToastProvider closeButton position="top-center" />
        </Suspense>
      )}
    </notificationContext.Provider>
  );
};
