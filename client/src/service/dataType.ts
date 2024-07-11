export interface MyInfo {
  email: string;
  id: number;
  name: string;
  pokeds: number;
  pokes: number;
  token: string;
  profileImageUrl: null | string;
  pushSubscription: null | string;
}

export interface User {
  email: string;
  id: number;
  name: string;
  profileImageUrl: string | null;
}

export interface Poke {
  id: number;
  payload: { type: "normal" } | { type: "emoji"; message: string };
  createdAt: string;
  fromUserId: number;
  toUserId: number;
  relation: Relation;
}

export interface Relation {
  fromUserId: number;
  toUserId: number;
  isAccepted: boolean;
  fromUser: User;
  toUser: User;
}
