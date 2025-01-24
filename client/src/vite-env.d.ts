/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_MAPBOX_ACCESS_TOKEN: string;
  readonly VITE_VAPID_PUBLIC_KEY: string;
  readonly VITE_YOGI_POKE_API_URL: string;
}
