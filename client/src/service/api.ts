import axios from "axios";

export const yogiPokeApi = axios.create({
  baseURL: import.meta.env.VITE_YOGI_POKE_API_URL,
  paramsSerializer: (paramObj) =>
    Object.entries(paramObj)
      .reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((value: string) => {
            acc.append(key, value);
          });
        } else {
          acc.append(key, value as string);
        }
        return acc;
      }, new URLSearchParams())
      .toString(),
});
