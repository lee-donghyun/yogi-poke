import { KyInstance } from "ky";

export const createFetcher =
  (client: KyInstance) =>
  ([key, params]: [string, Record<string, string>]) =>
    client.get(key, { searchParams: params }).json();
