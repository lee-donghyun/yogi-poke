import ky from "ky";

export const yogiPokeApi = ky.create({
  prefixUrl: "/api",
});
