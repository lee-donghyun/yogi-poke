import { ImgHTMLAttributes, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

import { useDebouncedValue } from "~/hook/base/useDebouncedValue";

enum View {
  THUMBNAIL,
  VIEWER,
}

const THUMBNAIL_TRANSITION_NAME = "image-thumbnail";
const ANIMATION_DURATION = 300;
const VIEWER_SIZE_IN_VW = 50;

export const Image = ({
  alt,
  size,
  src,
  ...props
}: {
  size: number;
} & Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "className" | "src" | "style"
> &
  Required<Pick<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src">>) => {
  const thumbnailRef = useRef<HTMLImageElement>(null);
  const viewerRef = useRef<HTMLImageElement>(null);
  const [view, setView] = useState(View.THUMBNAIL);
  const visible =
    useDebouncedValue(view === View.VIEWER, ANIMATION_DURATION, {
      strategy: "latest",
    }) && view === View.VIEWER;

  const openViewer = () => {
    if (!document.startViewTransition) {
      return setView(View.VIEWER);
    }

    const transition = document.startViewTransition(() => setView(View.VIEWER));

    void transition.ready.then(() => {
      const thumbnail = thumbnailRef.current?.getBoundingClientRect();
      if (!thumbnail) {
        return;
      }

      const vw = window.innerWidth / 100;
      const vh = window.innerHeight / 100;

      const scale = (VIEWER_SIZE_IN_VW * vw) / thumbnail.width;
      const translateX = -thumbnail.left + 50 * vw - thumbnail.width / 2;
      const translateY = -thumbnail.top + 50 * vh - thumbnail.height / 2;

      document.documentElement.animate(
        [
          {
            opacity: 1,
            // eslint-disable-next-line lingui/no-unlocalized-strings
            transform: `translate(0, 0) scale(1)`,
          },
          {
            opacity: 1,
            // eslint-disable-next-line lingui/no-unlocalized-strings
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          },
        ],
        {
          duration: ANIMATION_DURATION,
          fill: "both",
          pseudoElement: `::view-transition-old(${THUMBNAIL_TRANSITION_NAME})`,
        },
      );
    });
  };

  const closeViewer = () => {
    if (!document.startViewTransition) {
      return setView(View.THUMBNAIL);
    }

    const transition = document.startViewTransition(() =>
      setView(View.THUMBNAIL),
    );

    void transition.ready.then(() => {
      const thumbnail = thumbnailRef.current?.getBoundingClientRect();
      if (!thumbnail) {
        return;
      }

      const vw = window.innerWidth / 100;
      const vh = window.innerHeight / 100;

      const scale = (VIEWER_SIZE_IN_VW * vw) / thumbnail.width;
      const translateX = -thumbnail.left + 50 * vw - thumbnail.width / 2;
      const translateY = -thumbnail.top + 50 * vh - thumbnail.height / 2;

      document.documentElement.animate(
        [
          {
            opacity: 1,
            // eslint-disable-next-line lingui/no-unlocalized-strings
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          },
          {
            opacity: 1,
            // eslint-disable-next-line lingui/no-unlocalized-strings
            transform: `translate(0, 0) scale(1)`,
          },
        ],
        {
          duration: ANIMATION_DURATION,
          fill: "both",
          pseudoElement: `::view-transition-old(${THUMBNAIL_TRANSITION_NAME})`,
        },
      );
    });
  };

  return (
    <>
      <button onClick={openViewer}>
        <img
          {...props}
          alt={alt}
          className={`rounded-full object-cover ${view === View.VIEWER ? "invisible" : ""}`}
          ref={thumbnailRef}
          src={src}
          style={{
            height: size,
            viewTransitionName: THUMBNAIL_TRANSITION_NAME,
            width: size,
          }}
        />
      </button>
      {view === View.VIEWER &&
        createPortal(
          <RemoveScroll>
            <button
              className="fixed inset-0 z-50 backdrop-blur-md"
              onClick={closeViewer}
            ></button>
            <div
              className={`absolute top-1/2 left-1/2 z-[51] -translate-x-1/2 -translate-y-1/2 rounded-full ${
                visible ? "" : "invisible"
              }`}
              style={{
                height: `${VIEWER_SIZE_IN_VW}vw`,
                width: `${VIEWER_SIZE_IN_VW}vw`,
              }}
            >
              <img
                {...props}
                alt={alt}
                className="rounded-full object-cover"
                ref={viewerRef}
                src={src}
                style={{
                  height: `${VIEWER_SIZE_IN_VW}vw`,
                  width: `${VIEWER_SIZE_IN_VW}vw`,
                }}
              />
            </div>
          </RemoveScroll>,
          document.body,
        )}
    </>
  );
};
