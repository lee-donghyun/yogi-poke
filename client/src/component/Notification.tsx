import { createContext, useState, JSX, useContext } from "react";
import { createPortal } from "react-dom";

type NotificationData = {
  content: string;
  id: number;
};

const notificationContext = createContext<
  (notification: Omit<NotificationData, "id">) => void
>(() => {
  throw new Error(
    "useNotification hook need to be called in NotificationProvider"
  );
});

const initialNotificaion = { data: [], cursor: 0 };

export const useNotification = () => {
  return useContext(notificationContext);
};

export const NotificationProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [{ data, cursor }, setNotifications] = useState<{
    data: NotificationData[];
    cursor: number;
  }>(initialNotificaion);

  const pushNotification = (n: Omit<NotificationData, "id">) => {
    const next = { ...n, id: Date.now() };
    setNotifications(({ data, cursor }) => ({
      data: [...data, next],
      cursor: cursor + 1,
    }));
    setTimeout(() => {
      setNotifications((p) => {
        const nextCursor = p.cursor + 1;
        setTimeout(() => {
          setNotifications((p) => {
            if (nextCursor === p.data.length * 2) {
              return initialNotificaion;
            }
            return p;
          });
        }, 300);
        return { data: p.data, cursor: nextCursor };
      });
    }, 3000);
  };

  return (
    <notificationContext.Provider value={pushNotification}>
      {data.length > 0 &&
        createPortal(
          <div
            className="fixed inset-x-0 top-0 z-10 duration-300"
            style={{
              transform: `translateY(${84 * (data.length - cursor)}px)`,
            }}
          >
            {data.map((n) => (
              <div
                key={n.id}
                className="m-5 mb-0 rounded-xl p-5 shadow-lg backdrop-blur backdrop-brightness-95"
              >
                {n.content}
              </div>
            ))}
          </div>,
          document.body
        )}
      {children}
    </notificationContext.Provider>
  );
};
