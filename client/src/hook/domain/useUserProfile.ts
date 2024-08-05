import useSWR from "swr";

import { AuthProvider } from "../../service/dataType.ts";

interface UserData {
  authProvider: AuthProvider;
  email: string;
  id: number;
  name: string;
  pokeds: number;
  pokes: number;
  profileImageUrl: null | string;
}

export const SWR_KEY_USER = (email: string) => [`/user/${email}`];

export const useUserPofile = (email: string) =>
  useSWR<UserData>(SWR_KEY_USER(email));
