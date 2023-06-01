import { JSX, useEffect, useMemo, useState } from "react";
import { enableBodyScroll } from "body-scroll-lock";
import { yogiPokeApi } from "../service/api";
import { MyInfo } from "../service/type";

const TOKEN_PERSIST_KEY = "TOKEN";
const IS_PWA_PERSIST_KEY = "IS_PWA";
const IS_PWA_SEARCH_KEY = "is-pwa";
const TRUE = "1";
const splashElement = document.getElementById("splash") as HTMLElement;

export const persisteToken = (token: string) => {
  localStorage.setItem(TOKEN_PERSIST_KEY, token);
};

const isPwaMode = () => {
  if (localStorage.getItem(IS_PWA_PERSIST_KEY) === TRUE) {
    return true;
  }
  if (
    new URLSearchParams(self.location.search).get(IS_PWA_SEARCH_KEY) === TRUE
  ) {
    localStorage.setItem(IS_PWA_PERSIST_KEY, TRUE);
    return true;
  }
  return false;
};

const closeSplash = (delay: number) => {
  setTimeout(() => {
    splashElement?.classList.add("opacity-0", "pointer-events-none");
    enableBodyScroll(document.body);
  }, delay);
};

type Prefetch = {
  myInfo: null | MyInfo;
};

export const PwaProvider = ({
  children,
}: {
  children: (prefetch: Prefetch) => JSX.Element;
}) => {
  const [prefetch, setPrefetch] = useState<null | Prefetch>(null);

  const isPwa = isPwaMode();
  const token = useMemo(() => localStorage.getItem(TOKEN_PERSIST_KEY), []);

  useEffect(() => {
    if (typeof token === "string") {
      let ignore = false;
      yogiPokeApi
        .get<MyInfo>("/user/my-info", { headers: { Authorization: token } })
        .then(
          (res) => !ignore && setPrefetch({ myInfo: { ...res.data, token } })
        )
        .catch(() => setPrefetch({ myInfo: null }));
      return () => {
        ignore = true;
      };
    }
  }, [token]);

  if (!isPwa) {
    closeSplash(500);
    return <div>홈화면에 추가해달라는 문구</div>;
  }
  if (token === null) {
    closeSplash(500);
    return children({ myInfo: null });
  }
  if (prefetch === null) {
    return <div></div>;
  }
  closeSplash(100);
  return children(prefetch);
};
