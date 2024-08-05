import { KyInstance } from "ky";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "router2";
import { SWRConfig } from "swr";

import { client } from "../../service/api.ts";
import { MyInfo } from "../../service/dataType.ts";
import { VoidFunction } from "../../service/type.ts";
import { persisteToken } from "./PwaProvider.tsx";

interface PatchUserPayload {
  name?: string;
  profileImageUrl?: string;
  pushSubscription?: null | PushSubscriptionJSON;
}

const authContext = createContext<{
  client: KyInstance;
  isLoggedIn: boolean;
  myInfo: MyInfo | null;
  patchUser: (payload: PatchUserPayload, token?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  registerToken: (token: string) => Promise<string>;
}>({
  client,
  isLoggedIn: false,
  myInfo: null,
  patchUser: () => {
    throw new Error("patchUser need to be called within AuthProvider context");
  },
  refreshUser: () => {
    throw new Error("patchUser need to be called within AuthProvider context");
  },
  registerToken: () => {
    throw new Error(
      "registerToken need to be called within AuthProvider context",
    );
  },
});

export const useUser = ({
  assertAuth,
  revalidateIfHasToken,
}: {
  /**
   * 로그인이 되어있지 않은 경우 로그인 페이지로 이동합니다.
   */
  assertAuth?: boolean;
  /**
   * 훅이 호출될때 최신 정보임을 확인합니다. 토큰이 있는 경우에만 활성화됩니다.
   * @warn 이 옵션은 페이지 단위의 훅 호출에서만 사용되어야 합니다. 여러 컴포넌트에서 동시에 사용한다면 불필요한 요청이 발생할 수 있습니다.
   * @default false
   */
  revalidateIfHasToken?: boolean;
} = {}) => {
  const { navigate, path } = useRouter();
  const auth = useContext(authContext);

  const { isLoggedIn, refreshUser } = auth;

  if (assertAuth && !isLoggedIn) {
    navigate(
      {
        pathname: "/sign-in",
        ...(path && { query: { returnUrl: path } }),
      },
      { replace: true },
    );
  }

  useEffect(() => {
    if (revalidateIfHasToken && isLoggedIn) {
      void refreshUser();
      self.addEventListener("focus", refreshUser as VoidFunction);
      return () => {
        self.removeEventListener("focus", refreshUser as VoidFunction);
      };
    }
  }, [revalidateIfHasToken, isLoggedIn, refreshUser]);

  return { ...auth };
};

export const AuthProvider = ({
  children,
  myInfo: prefetchedMyInfo,
}: {
  children: JSX.Element;
  myInfo: MyInfo | null;
}) => {
  const [myInfo, setMyInfo] = useState<MyInfo | null>(prefetchedMyInfo);

  const userClient = useMemo(() => {
    if (myInfo?.token) {
      return client.extend({
        headers: { Authorization: myInfo.token },
      });
    }
    return client;
  }, [myInfo?.token]);

  const registerToken = useCallback(
    (token: string) =>
      userClient
        .get("user/my-info", {
          headers: { Authorization: token },
        })
        .json<Exclude<MyInfo, "token">>()
        .then((data) => {
          setMyInfo({ ...data, token });
          persisteToken(token);
          return token;
        }),
    [userClient],
  );
  /**
   * @warn token이 없는 클로저에서 호출될때 token을 명시적으로 주입해야합니다.
   */
  const patchUser = useCallback(
    (myInfo: PatchUserPayload, token?: string) =>
      userClient
        .patch("user/my-info", {
          ...(token && { headers: { Authorization: token } }),
          json: myInfo,
        })
        .json<MyInfo>()
        .then((user) => {
          setMyInfo((p) => ({ ...p, ...user }));
        }),
    [userClient],
  );
  const refreshUser = useCallback(
    () =>
      userClient
        .get("user/my-info")
        .json<Exclude<MyInfo, "token">>()
        .then((data) => {
          setMyInfo((p) => ({ ...p, ...data }));
        }),
    [userClient],
  );

  return (
    <authContext.Provider
      value={{
        client: userClient,
        isLoggedIn: myInfo !== null,
        myInfo,
        patchUser,
        refreshUser,
        registerToken,
      }}
    >
      <SWRConfig
        value={{
          fetcher: ([key, params]: [string, Record<string, string>]) =>
            userClient.get(key, { searchParams: params }).json(),
        }}
      >
        {children}
      </SWRConfig>
    </authContext.Provider>
  );
};
