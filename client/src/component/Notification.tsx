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

const initialNotificaion = { data: [], cursor: -1 };

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
    setNotifications(({ data }) => ({
      data: [next, ...data],
      cursor: 0,
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
            data: p.data,
            cursor: -1,
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
                key={n.id}
                className={`absolute inset-x-5 top-5 rounded-xl p-5 shadow-lg backdrop-blur backdrop-brightness-95 duration-300 ${
                  cursor === i * 2 ? "from-top" : "to-top"
                }`}
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
