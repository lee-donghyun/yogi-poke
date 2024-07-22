import useSWR from "swr";

import { AuthProvider } from "../service/dataType";

interface UserData {
  email: string;
  id: number;
  name: string;
  profileImageUrl: null | string;
  pokeds: number;
  pokes: number;
  authProvider: AuthProvider;
}

export const SWR_KEY_USER = (email: string) => [`/user/${email}`];

export const useUserPofile = (email: string) =>
  useSWR<UserData>(SWR_KEY_USER(email));
