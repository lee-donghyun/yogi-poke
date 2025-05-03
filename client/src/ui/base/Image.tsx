import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

import { useKeyboard } from "~/hook/base/useKeyboard";
import { useViewTransition } from "~/hook/base/useViewTransition";

enum View {
  THUMBNAIL,
  VIEWER,
}

type ImageProps = {
  size: number;
  transitionName: string;
} & Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "className" | "src" | "style"
> &
  Required<Pick<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src">>;

const VIEWER_SIZE_IN_VW = 64;

export const Image = ({
  alt,
  size,
  src,
  transitionName,
  ...props
}: ImageProps) => {
  const backdropRef = useRef<HTMLButtonElement>(null);

  const [view, setView] = useState(View.THUMBNAIL);

  const { startTransition, style, viewTransitionName } = useViewTransition({
    name: transitionName,
  });

  const openViewer = () => {
    startTransition(() => setView(View.VIEWER));
  };

  const closeViewer = () => {
    startTransition(() => setView(View.THUMBNAIL));
  };

  useKeyboard(() => {
    if (view === View.VIEWER) {
      closeViewer();
    }
    // eslint-disable-next-line lingui/no-unlocalized-strings
  }, "Escape");

  useEffect(() => {
    if (view === View.VIEWER) {
      backdropRef.current?.focus();
    }
  }, [view]);

  return (
    <>
      {style}
      <button onClick={openViewer}>
        {view === View.THUMBNAIL && (
          <img
            {...props}
            alt={alt}
            className="rounded-full object-cover"
            src={src}
            style={{
              height: size,
              viewTransitionName,
              width: size,
            }}
          />
        )}
        {view === View.VIEWER && (
          <div
            style={{
              height: size,
              width: size,
            }}
          />
        )}
      </button>
      {view === View.VIEWER &&
        createPortal(
          <RemoveScroll>
            <div aria-modal="true" role="dialog">
              <div className="fixed inset-0 z-50 backdrop-blur-md backdrop-brightness-95"></div>
              <button
                className="fixed inset-0 z-50 flex items-center justify-center"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    closeViewer();
                  }
                }}
                ref={backdropRef}
              >
                <img
                  {...props}
                  alt={alt}
                  className="rounded-full object-cover"
                  src={src}
                  style={{
                    height: `${VIEWER_SIZE_IN_VW}vw`,
                    viewTransitionName,
                    width: `${VIEWER_SIZE_IN_VW}vw`,
                  }}
                />
              </button>
            </div>
          </RemoveScroll>,
          document.body,
        )}
    </>
  );
};
