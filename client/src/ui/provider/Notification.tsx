import { createContext, JSX, ReactNode, useContext, useState } from "react";
import { createPortal } from "react-dom";

interface NotificationData {
  content: ReactNode;
  id: number;
}

const notificationContext = createContext<
  (notification: Omit<NotificationData, "id">) => void
>(() => {
  throw new Error(
    "useNotification hook-domain need to be called in NotificationProvider",
  );
});

const initialNotificaion = { cursor: -1, data: [] };

export const useNotification = () => {
  return useContext(notificationContext);
};

export const NotificationProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [{ cursor, data }, setNotifications] = useState<{
    cursor: number;
    data: NotificationData[];
  }>(initialNotificaion);

  const pushNotification = (n: Omit<NotificationData, "id">) => {
    const next = { ...n, id: Date.now() };
    setNotifications(({ data }) => ({
      cursor: 0,
      data: [next, ...data],
    }));
    setTimeout(() => {
      setNotifications((p) => {
        if (p.data.indexOf(next) === 0) {
          setTimeout(() => {
            if (p.data.indexOf(next) === 0) {
              setNotifications(initialNotificaion);
            }
          }, 500);
          return {
            cursor: -1,
            data: p.data,
          };
        }
        return p;
      });
    }, 3000);
  };

  return (
    <notificationContext.Provider value={pushNotification}>
      {data.length > 0 &&
        createPortal(
          <div className="fixed inset-x-0 top-0 z-50">
            {data.map((n, i) => (
              <div
                className={`absolute inset-x-5 top-5 rounded-xl bg-white/70 p-5 shadow-lg backdrop-blur backdrop-brightness-95 duration-300 ${
                  cursor === i * 2 ? "from-top" : "to-top"
                }`}
                key={n.id}
              >
                {n.content}
              </div>
            ))}
          </div>,
          document.body,
        )}
      {children}
    </notificationContext.Provider>
  );
};
