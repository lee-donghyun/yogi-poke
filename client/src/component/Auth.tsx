import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "router2";
import { SWRConfig } from "swr";

import { yogiPokeApi } from "../service/api";
import { MyInfo } from "../service/dataType";
import { VoidFunction } from "../service/type";
import { persisteToken } from "./PwaProvider";

interface PatchUserPayload {
  pushSubscription?: PushSubscriptionJSON | null;
  profileImageUrl?: string;
  name?: string;
}

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
      "registerToken need to be called within AuthProvider context",
    );
  },
  patchUser: () => {
    throw new Error("patchUser need to be called within AuthProvider context");
  },
  refreshUser: () => {
    throw new Error("patchUser need to be called within AuthProvider context");
  },
});

export const useUser = ({
  revalidateIfHasToken,
  assertAuth,
}: {
  /**
   * 훅이 호출될때 최신 정보임을 확인합니다. 토큰이 있는 경우에만 활성화됩니다.
   * @warn 이 옵션은 페이지 단위의 훅 호출에서만 사용되어야 합니다. 여러 컴포넌트에서 동시에 사용한다면 불필요한 요청이 발생할 수 있습니다.
   * @default false
   */
  revalidateIfHasToken?: boolean;
  /**
   * 로그인이 되어있지 않은 경우 로그인 페이지로 이동합니다.
   */
  assertAuth?: boolean;
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
  const registerToken = useCallback(
    (token: string) =>
      yogiPokeApi
        .get("/user/my-info", {
          headers: { Authorization: token },
        })
        .then(({ data }: { data: Exclude<MyInfo, "token"> }) => {
          setMyInfo({ ...data, token });
          persisteToken(token);
          yogiPokeApi.defaults.headers.Authorization = token;
        }),
    [],
  );
  const patchUser = useCallback(
    (myInfo: PatchUserPayload) =>
      yogiPokeApi.patch<MyInfo>("/user/my-info", myInfo).then((user) => {
        setMyInfo((p) => ({ ...p, ...user.data }));
      }),
    [],
  );
  const refreshUser = useCallback(
    () =>
      yogiPokeApi
        .get("/user/my-info")
        .then(({ data }: { data: Exclude<MyInfo, "token"> }) => {
          setMyInfo((p) => ({ ...p, ...data }));
        }),
    [],
  );

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
          fetcher: ([key, params]: [string, object]) =>
            yogiPokeApi
              .get<unknown>(key, {
                params,
                headers: { Authorization: myInfo?.token },
              })
              .then((res) => res.data),
        }}
      >
        {children}
      </SWRConfig>
    </authContext.Provider>
  );
};
