import { useEffect } from "react";

import { useLiveRef } from "~/hook/base/useLiveRef";

export const useKeyboard = (
  callback: (e: KeyboardEvent) => void,
  key: KeyboardEvent["key"],
) => {
  const callbackRef = useLiveRef(callback);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== key) return;
      callbackRef.current(e);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [callbackRef, key]);
};
