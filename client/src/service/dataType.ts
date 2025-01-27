import { type Line } from "~/ui/base/Canvas";

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
  pushOnFollow: boolean;
  pushOnPoke: boolean;
  pushSubscription: null | string;
  token: string;
}

export interface Poke {
  createdAt: string;
  fromUserId: number;
  id: number;
  payload:
    | { lines: Line[]; type: "drawing" }
    | { message: string; type: "emoji" }
    | { position: { latitude: number; longitude: number }; type: "geolocation" }
    | { type: "normal" };
  relation: Relation;
  toUserId: number;
}

export interface Relation {
  fromUser: null | User;
  toUser: null | User;
}

export interface User {
  authProvider: AuthProvider;
  email: string;
  id: number;
  name: string;
  profileImageUrl: null | string;
}
