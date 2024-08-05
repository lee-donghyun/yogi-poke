import axios from "axios";
import ky from "ky";

export const yogiPokeApi = axios.create({
  baseURL: import.meta.env.VITE_YOGI_POKE_API_URL,
});

export const client = ky.create({
  prefixUrl: import.meta.env.VITE_YOGI_POKE_API_URL,
});
