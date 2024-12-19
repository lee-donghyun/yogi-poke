import { ReactNode, useEffect } from "react";
import { useRouter } from "router2";

import { useRelatedPokeList } from "../../hook/domain/useRelatedPokeList";

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
  const { navigate } = useRouter();
  const { mutate } = useRelatedPokeList();

  useEffect(() => {
    const listener = (event: MessageEvent<Message>) => {
      switch (event.data.type) {
        case "NAVIGATE":
          navigate({ pathname: event.data.data.url });
          break;
        case "REVALIDATE_RELATED_POKES":
          void mutate();
          break;
      }
    };

    self.addEventListener("message", listener);
    return () => {
      self.removeEventListener("message", listener);
    };
  }, [mutate, navigate]);

  return children;
};
