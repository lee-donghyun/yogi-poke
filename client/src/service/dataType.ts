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
