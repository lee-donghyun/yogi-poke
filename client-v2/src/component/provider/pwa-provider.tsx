import { createSignal, JSX, Match, Switch } from "solid-js";

import { useApiInstance, useAuth } from "./auth-provider";

const TOKEN_PERSIST_KEY = "TOKEN";
const IS_PWA_PERSIST_KEY = "IS_PWA";
const IS_PWA_SEARCH_KEY = "is-pwa";
const TRUE = "1";

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

const token = (() => {
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
})();

interface MyInfo {
  id: number;
}

type MyInfoSignal = MyInfo | null | undefined;

export const PwaProvider = (props: {
  children: (props: { myInfo: MyInfo | null }) => JSX.Element;
}) => {
  const isPwa = isPwaMode();
  const isValidToken = typeof token === "string";
  const shouldFetchMyInfo = isPwa && isValidToken;

  const [myInfo, setMyInfo] = createSignal<MyInfoSignal>(
    shouldFetchMyInfo ? undefined : null,
  );

  const api = useApiInstance();

  if (shouldFetchMyInfo) {
    void api
      .get("my-info")
      .json<MyInfo>()
      .then(setMyInfo)
      .catch(() => setMyInfo(() => null));
  }

  return (
    <Switch>
      <Match when={!isPwa}>Introduction</Match>
      <Match when={isPwa && myInfo() === null}>
        {props.children({ myInfo: null })}
      </Match>
      <Match when={isPwa && myInfo()}>
        {(myInfo) => props.children({ myInfo: myInfo() })}
      </Match>
    </Switch>
  );
};
