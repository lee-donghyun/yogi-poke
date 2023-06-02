import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { yogiPokeApi } from "../service/api";
import useSWR, { SWRConfig } from "swr";
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

export const useUser = ({
  revalidateIfHasToken,
}: {
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

  const assertAuth = () => {
    if (!isLoggedIn) {
      navigate(
        {
          pathname: "/sign-in",
          ...(path && { query: { returnUrl: path } }),
        },
        { replace: true }
      );
    }
  };

  useEffect(() => {
    if (revalidateIfHasToken && isLoggedIn) {
      refreshUser();
      self.addEventListener("focus", refreshUser);
      return () => {
        self.removeEventListener("focus", refreshUser);
      };
    }
  }, [revalidateIfHasToken, isLoggedIn, refreshUser]);

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
  const registerToken = useCallback(
    (token: string) =>
      yogiPokeApi
        .get("/user/my-info", {
          headers: { Authorization: token },
        })
        .then(({ data }) => {
          setMyInfo({ ...data, token });
          persisteToken(token);
          yogiPokeApi.defaults.headers.Authorization = token;
        }),
    []
  );
  const patchUser = useCallback(
    (myInfo: PatchUserPayload) =>
      yogiPokeApi
        .patch<MyInfo>("/user/my-info", myInfo)
        .then((user) => setMyInfo((p) => ({ ...p, ...user.data }))),
    []
  );
  const refreshUser = useCallback(
    () =>
      yogiPokeApi.get("/user/my-info").then(({ data }) => {
        setMyInfo((p) => ({ ...p, ...data }));
      }),
    []
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
