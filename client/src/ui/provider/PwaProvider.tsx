import { enableBodyScroll } from "body-scroll-lock-upgrade";
import { JSX, lazy, Suspense, useEffect, useMemo, useState } from "react";

import { yogiPokeApi } from "../../service/api.ts";
import { MyInfo } from "../../service/dataType.ts";

const Introduction = lazy(() =>
  import("../page/Introduction.tsx").then((mod) => ({
    default: mod.Introduction,
  })),
);

const TOKEN_PERSIST_KEY = "TOKEN";
const IS_PWA_PERSIST_KEY = "IS_PWA";
const IS_PWA_SEARCH_KEY = "is-pwa";
const TRUE = "1";
const splashElement = document.getElementById("splash");

export const persisteToken = (token: string) => {
  localStorage.setItem(TOKEN_PERSIST_KEY, token);
};

export const releaseToken = () => {
  localStorage.removeItem(TOKEN_PERSIST_KEY);
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

interface Prefetch {
  myInfo: null | MyInfo;
}

export const PwaProvider = ({
  children,
}: {
  children: (prefetch: Prefetch) => JSX.Element;
}) => {
  const [prefetch, setPrefetch] = useState<null | Prefetch>(null);

  const isPwa = isPwaMode();
  const token = useMemo(() => {
    const searchToken = new URLSearchParams(location.search).get("token");
    if (typeof searchToken === "string") {
      persisteToken(searchToken);
      return searchToken;
    }
    const persistedToken = localStorage.getItem(TOKEN_PERSIST_KEY);
    if (typeof persistedToken === "string") {
      return persistedToken;
    }
    return null;
  }, []);

  useEffect(() => {
    if (typeof token === "string") {
      let ignore = false;
      yogiPokeApi
        .get<MyInfo>("/user/my-info", { headers: { Authorization: token } })
        .then((res) => {
          if (!ignore) {
            setPrefetch({ myInfo: { ...res.data, token } });
            yogiPokeApi.defaults.headers.Authorization = token;
          }
        })
        .catch(() => {
          setPrefetch({ myInfo: null });
        });
      return () => {
        ignore = true;
      };
    }
  }, [token]);

  if (!isPwa) {
    closeSplash(500);
    return (
      <Suspense>
        <Introduction />
      </Suspense>
    );
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
