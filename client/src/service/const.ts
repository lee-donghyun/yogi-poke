import { AuthProvider } from "./dataType";

export const LIKE_PERSIST_KEY = "LIKE";

export const DELETED_USER = {
  authProvider: AuthProvider.INSTAGRAM,
  email: "",
  id: -1,
  name: "(알수없음)",
  profileImageUrl: null,
};

export const DAY_IN_UNIX = 1000 * 60 * 60 * 24;
export const MINUTE_IN_UNIX = 1000 * 60;
