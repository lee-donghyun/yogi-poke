import { createContext, useContext, useState } from "react";
import { yogiPokeApi } from "../service/api";
import { SWRConfig } from "swr";
import { useRouter } from "../lib/router2";
import { MyInfo } from "../service/type";
import { persisteToken } from "./PwaProvider";

type PatchUserPayload = {
  pushSubscription?: PushSubscriptionJSON;
  name?: string;
};

const authContext = createContext<{
  myInfo: MyInfo | null;
  registerToken: (token: string) => Promise<void>;
  isLoggedIn: boolean;
  patchUser: (payload: PatchUserPayload) => Promise<void>;
  refreshUser: () => Promise<void>;
}>({
  myInfo: null,
  isLoggedIn: false,
  registerToken: () => {
    throw new Error(
      "registerToken need to be called within AuthProvider context"
    );
  },
  patchUser: () => {
    throw new Error("patchUser need to be called within AuthProvider context");
  },
  refreshUser: () => {
    throw new Error("patchUser need to be called within AuthProvider context");
  },
});

export const useUser = () => {
  const { navigate, path } = useRouter();
  const auth = useContext(authContext);
  const assertAuth = () => {
    if (!auth.isLoggedIn) {
      navigate(
        {
          pathname: "/sign-in",
          ...(path && { query: { returnUrl: path } }),
        },
        { replace: true }
      );
    }
  };
  return { ...auth, assertAuth };
};

export const AuthProvider = ({
  children,
  myInfo: prefetchedMyInfo,
}: {
  children: JSX.Element;
  myInfo: MyInfo | null;
}) => {
  const [myInfo, setMyInfo] = useState<MyInfo | null>(prefetchedMyInfo);
  const registerToken = (token: string) =>
    yogiPokeApi
      .get("/user/my-info", {
        headers: { Authorization: token },
      })
      .then(({ data }) => {
        setMyInfo({ ...data, token });
        persisteToken(token);
        yogiPokeApi.defaults.headers.Authorization = token;
      });
  const patchUser = (myInfo: PatchUserPayload) =>
    yogiPokeApi
      .patch<MyInfo>("/user/my-info", myInfo)
      .then((user) => setMyInfo((p) => ({ ...p, ...user.data })));
  const refreshUser = () =>
    yogiPokeApi.get("/user/my-info").then(({ data }) => {
      setMyInfo((p) => ({ ...p, ...data }));
    });

  return (
    <authContext.Provider
      value={{
        myInfo,
        registerToken,
        patchUser,
        refreshUser,
        isLoggedIn: myInfo !== null,
      }}
    >
      <SWRConfig
        value={{
          fetcher: ([key, params]) =>
            yogiPokeApi
              .get(key, { params, headers: { Authorization: myInfo?.token } })
              .then((res) => res.data),
        }}
      >
        {children}
      </SWRConfig>
    </authContext.Provider>
  );
};
