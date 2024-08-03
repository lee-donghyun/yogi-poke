import ky, { KyInstance } from "ky";

class YogiPokeApi {
  api: KyInstance;
  constructor() {
    this.api = ky.create({ prefixUrl: "/api" });
  }
  setToken(token: string) {
    this.api = ky.extend({
      headers: { Authorization: `Bearer ${token}` },
      prefixUrl: "/api",
    });
  }
}

export const api = new YogiPokeApi();
