declare namespace NodeJS {
  interface ProcessEnv {
    CLIENT_HOST: string;
    CLIENT_URL: string;
    DATABASE_URL: string;
    PORT: string;
    SERVER_URL: string;
    STORAGE_ACCESS_KEY: string;
    STORAGE_ASSET_BUCKET_ID: string;
    STORAGE_ENDPOINT: string;
    STORAGE_PORT: string;
    STORAGE_SECRET_KEY: string;
    USER_SECRET: string;
    VAPID_PRIVATE_KEY: string;
    VAPID_PUBLIC_KEY: string;
    VAPID_SUBJECT: string;
  }
}
