import { useSyncExternalStore } from "react";

import { try_ } from "../lib/expify";

type Notifier = () => void;

const LISTENERS: Notifier[] = [];

const subscribe = (onStoreChange: Notifier) => {
  LISTENERS.push(onStoreChange);
  return () => {
    LISTENERS.splice(LISTENERS.indexOf(onStoreChange), 1);
  };
};

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const value = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key) ?? JSON.stringify(defaultValue),
  );
  const setValue = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
    LISTENERS.forEach((l) => {
      l();
    });
  };
  return [
    try_(() => JSON.parse(value))._catch(() => defaultValue) as T,
    setValue,
  ] as const;
};
