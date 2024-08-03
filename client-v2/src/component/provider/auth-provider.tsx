import ky from "ky";
import { createContext, useContext } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

interface AuthProviderProps {
  children: JSX.Element;
  token: string;
}

const authContext = createContext(ky);

export const useApiInstance = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("AuthProvider not found");
  return context;
};

export const AuthProvider = (props: AuthProviderProps) => {
  return (
    <authContext.Provider
      children={props.children}
      value={ky.create({
        // eslint-disable-next-line solid/reactivity
        headers: { Authorization: `Bearer ${props.token}` },
        prefixUrl: "/api",
      })}
    />
  );
};
