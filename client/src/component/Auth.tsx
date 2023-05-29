import { createContext, useContext, useState } from "react";
import { yogiPokeApi } from "../service/api";
import { SWRConfig } from "swr";
import { useRouter } from "../lib/router2";

type MyInfo = {
  email: string;
  id: number;
  name: string;
  pokeds: number;
  pokes: number;
  token: string;
};

const authContext = createContext<{
  myInfo: MyInfo | null;
  registerToken: (token: string) => Promise<void>;
  isLoggedIn: boolean;
}>({
  myInfo: null,
  isLoggedIn: false,
  registerToken: () => {
    throw new Error(
      "registerToken need to be called within AuthProvider context"
    );
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

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const registerToken = async (token: string) =>
    yogiPokeApi
      .get("/user/my-info", {
        headers: { Authorization: token },
      })
      .then(({ data }) => setMyInfo({ ...data, token }));

  return (
    <authContext.Provider
      value={{ myInfo, registerToken, isLoggedIn: myInfo !== null }}
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
