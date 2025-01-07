import ky from "ky";

export const client = ky.create({
  prefixUrl: import.meta.env.VITE_YOGI_POKE_API_URL,
  retry: 0,
});
