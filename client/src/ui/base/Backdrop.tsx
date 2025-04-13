import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

import { useKeyboard } from "~/hook/base/useKeyborad";
import { Layer } from "~/ui/provider/StackedLayerProvider";

export const BACKDROP_ANIMATION_DURATION = 500;

export const Backdrop = ({
  children,
  close,
  descriptionId,
  titleId,
  visible,
}: {
  children: ReactNode;
} & Omit<Parameters<Layer>[0], "context">) => {
  const backdropRef = useRef<HTMLButtonElement>(null);

  // eslint-disable-next-line lingui/no-unlocalized-strings
  useKeyboard(close, "Escape");

  useEffect(() => {
    backdropRef.current?.focus();
  }, []);

  return createPortal(
    <RemoveScroll>
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        role="dialog"
      >
        <button
          aria-label="backdrop"
          className={`fixed inset-0 z-40 rounded-t-3xl bg-black/10 ${
            visible ? "animate-fade-in" : "animate-fade-out"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              close();
            }
          }}
          ref={backdropRef}
          type="button"
        />
        {children}
      </div>
    </RemoveScroll>,
    document.body,
  );
};
