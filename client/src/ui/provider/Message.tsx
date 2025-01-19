import { ReactNode, useEffect } from "react";
import { useRouter } from "router2";

import { mutateRelatedPokeList } from "../../hook/domain/useRelatedPokeList";

type Message =
  | {
      data: {
        url: string;
      };
      type: "NAVIGATE";
    }
  | {
      type: "REVALIDATE_RELATED_POKES";
    };

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();

  useEffect(() => {
    const listener = (event: MessageEvent<Message>) => {
      switch (event.data.type) {
        case "NAVIGATE":
          push({ pathname: event.data.data.url });
          break;
        case "REVALIDATE_RELATED_POKES":
          void mutateRelatedPokeList();
          break;
      }
    };
    self?.navigator?.serviceWorker?.addEventListener("message", listener);
    return () => {
      self?.navigator?.serviceWorker?.removeEventListener("message", listener);
    };
  }, [push]);

  return children;
};
