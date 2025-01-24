import QrScannerClient from "qr-scanner";
import { useEffect, useRef, useState } from "react";

import { Task } from "~/lib/task";

export const QrScanner = ({
  onScan,
}: {
  /**
   * memo가 된 함수를 전달합니다.
   */
  onScan: (scanner: QrScannerClient.ScanResult) => void;
}) => {
  const ref = useRef<HTMLVideoElement>(null);

  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    if (ref.current === null) return;
    const scanner = new QrScannerClient(ref.current, onScan, {
      highlightCodeOutline: true,
      highlightScanRegion: true,
    });

    const task = new Task();
    task.pipe(() => scanner.start());
    task.pipe(() => setPulse(false));
    return () => task.pipe(() => scanner.destroy());
  }, [onScan]);
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      className={`aspect-square w-full rounded-2xl bg-zinc-100 object-cover ${
        pulse ? "animate-pulse" : ""
      }`}
      ref={ref}
    ></video>
  );
};
