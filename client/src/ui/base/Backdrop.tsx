import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

export const BACKDROP_ANIMATION_DURATION = 500;

export const Backdrop = ({
  children,
  close,
  visible,
}: {
  children: ReactNode;
  close: () => void;
  visible: boolean;
}) => {
  return createPortal(
    <RemoveScroll>
      <button
        className={`fixed inset-0 z-40 rounded-t-3xl bg-black/10 ${
          visible ? "animate-fade-in" : "animate-fade-out"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            close();
          }
        }}
      />
      {children}
    </RemoveScroll>,
    document.body,
  );
};
