import useSWR from "swr";

interface UserPokeData {
  createdAt: string;
  id: number;
  fromUserId: number;
  toUserId: number;
}

export const SWR_KEY_MATE_POKE = (email: string) => [
  `/mate/poke/${email}`,
  { limit: 1 },
];

export const useUserRelatedPokeList = (email: string) =>
  useSWR<UserPokeData[]>(SWR_KEY_MATE_POKE(email));
