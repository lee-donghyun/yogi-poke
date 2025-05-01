import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

import { useKeyboard } from "~/hook/base/useKeyboard";

enum View {
  THUMBNAIL,
  VIEWER,
}

type ImageProps = {
  size: number;
} & Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "className" | "src" | "style"
> &
  Required<Pick<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src">>;

const TRANSITION_NAME = "thumbnail";
const VIEWER_SIZE_IN_VW = 64;

export const Image = ({ alt, size, src, ...props }: ImageProps) => {
  const backdropRef = useRef<HTMLButtonElement>(null);
  const [view, setView] = useState(View.THUMBNAIL);

  const openViewer = () => {
    if (!document.startViewTransition) {
      return setView(View.VIEWER);
    }

    document.startViewTransition(() => {
      flushSync(() => setView(View.VIEWER));
    });
  };

  const closeViewer = () => {
    if (!document.startViewTransition) {
      return setView(View.THUMBNAIL);
    }

    document.startViewTransition(() => {
      flushSync(() => setView(View.THUMBNAIL));
    });
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
      <button onClick={openViewer}>
        {view === View.THUMBNAIL && (
          <img
            {...props}
            alt={alt}
            className="rounded-full object-cover"
            src={src}
            style={{
              height: size,
              viewTransitionName: TRANSITION_NAME,
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
                    viewTransitionName: TRANSITION_NAME,
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
