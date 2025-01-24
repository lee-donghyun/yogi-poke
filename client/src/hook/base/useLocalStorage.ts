import { useSyncExternalStore } from "react";

import { try_ } from "~/lib/expify.ts";

type Notifier = () => void;

const LISTENERS: Notifier[] = [];

const subscribe = (onStoreChange: Notifier) => {
  LISTENERS.push(onStoreChange);
  return () => {
    LISTENERS.splice(LISTENERS.indexOf(onStoreChange), 1);
  };
};

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const value = useSyncExternalStore(subscribe, () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return item;
    }
    const defaultItem = JSON.stringify(defaultValue);
    localStorage.setItem(key, defaultItem);
    return defaultItem;
  });
  const setValue = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
    LISTENERS.forEach((l) => l());
  };
  return [
    try_(() => JSON.parse(value) as T)._catch(() => defaultValue),
    setValue,
  ] as const;
};
