export enum AuthProvider {
  EMAIL = "EMAIL",
  INSTAGRAM = "INSTAGRAM",
}

export interface MyInfo {
  authProvider: AuthProvider;
  email: string;
  id: number;
  name: string;
  pokeds: number;
  pokes: number;
  profileImageUrl: null | string;
  pushSubscription: null | string;
  token: string;
}

export interface User {
  authProvider: AuthProvider;
  email: string;
  id: number;
  name: string;
  profileImageUrl: null | string;
}

export interface Poke {
  createdAt: string;
  fromUserId: number;
  id: number;
  payload: { message: string; type: "emoji" } | { type: "normal" };
  relation: Relation;
  toUserId: number;
}

export interface Relation {
  fromUser: null | User;
  toUser: null | User;
}

export const isVerifiedUser = (user: User) =>
  [AuthProvider.INSTAGRAM].includes(user.authProvider);
