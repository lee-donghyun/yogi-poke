import axios from "axios";

export const yogiPokeApi = axios.create({
  baseURL: import.meta.env.VITE_YOGI_POKE_API_URL,
});
