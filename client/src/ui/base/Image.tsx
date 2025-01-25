import { ImgHTMLAttributes, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";

import { useDebouncedValue } from "~/hook/base/useDebouncedValue";

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

const THUMBNAIL_TRANSITION_NAME = "image-thumbnail";
const VIEWER_TRANSITION_NAME = "image-viewer";
const ANIMATION_DURATION = 150;
const VIEWER_SIZE_IN_VW = 64;

export const Image = ({ alt, size, src, ...props }: ImageProps) => {
  const thumbnailRef = useRef(null as unknown as HTMLImageElement);
  const viewerRef = useRef(null as unknown as HTMLImageElement);
  const [view, setView] = useState(View.THUMBNAIL);
  const debouncedIsViewer = useDebouncedValue(
    view === View.VIEWER,
    ANIMATION_DURATION,
    { strategy: "latest" },
  );

  const mounted = debouncedIsViewer || view === View.VIEWER;
  const visible = debouncedIsViewer && view === View.VIEWER;

  const openViewer = () => {
    if (!document.startViewTransition) {
      return setView(View.VIEWER);
    }

    thumbnailRef.current.style.viewTransitionName = THUMBNAIL_TRANSITION_NAME;

    const transition = document.startViewTransition(() => setView(View.VIEWER));

    void transition.ready.then(() => {
      const thumbnail = thumbnailRef.current.getBoundingClientRect();
      const vw = window.innerWidth / 100;
      const vh = window.innerHeight / 100;

      const scale = (VIEWER_SIZE_IN_VW * vw) / size;
      const translateX = -thumbnail.left + 50 * vw - size / 2;
      const translateY = -thumbnail.top + 50 * vh - size / 2;

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

    void transition.finished.then(() => {
      thumbnailRef.current.style.viewTransitionName = "";
    });
  };

  const closeViewer = () => {
    if (!document.startViewTransition) {
      return setView(View.THUMBNAIL);
    }

    viewerRef.current.style.viewTransitionName = VIEWER_TRANSITION_NAME;

    const transition = document.startViewTransition(() =>
      setView(View.THUMBNAIL),
    );

    void transition.ready.then(() => {
      const thumbnail = thumbnailRef.current.getBoundingClientRect();
      const vw = window.innerWidth / 100;
      const vh = window.innerHeight / 100;

      const scale = size / (VIEWER_SIZE_IN_VW * vw);
      const translateX = -50 * vw + size / 2 + thumbnail.left;
      const translateY = -50 * vh + size / 2 + thumbnail.top;

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
          pseudoElement: `::view-transition-old(${VIEWER_TRANSITION_NAME})`,
        },
      );
    });

    void transition.finished
      .then(() => {
        viewerRef.current.style.viewTransitionName = "";
      })
      .catch(console.error);
  };

  return (
    <>
      <button onClick={openViewer}>
        <img
          {...props}
          alt={alt}
          className={`rounded-full object-cover ${mounted ? "invisible" : ""}`}
          ref={thumbnailRef}
          src={src}
          style={{ height: size, width: size }}
        />
      </button>
      {mounted &&
        createPortal(
          <RemoveScroll>
            <>
              <div
                className={`fixed inset-0 z-50 backdrop-blur-md backdrop-brightness-95 ${
                  view === View.VIEWER ? "animate-fade-in" : "animate-fade-out"
                }`}
                key={view} // view 가 바뀌었을때 animation이 처음부터 실행되도록
                style={{ animationDuration: `${ANIMATION_DURATION}ms` }}
              ></div>
              <button
                className="fixed inset-0 z-50 flex items-center justify-center"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    closeViewer();
                  }
                }}
              >
                <img
                  {...props}
                  alt={alt}
                  className={`rounded-full object-cover ${visible ? "" : "invisible"}`}
                  ref={viewerRef}
                  src={src}
                  style={{
                    height: `${VIEWER_SIZE_IN_VW}vw`,
                    width: `${VIEWER_SIZE_IN_VW}vw`,
                  }}
                />
              </button>
            </>
          </RemoveScroll>,
          document.body,
        )}
    </>
  );
};
