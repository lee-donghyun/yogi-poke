import QrScannerClient from "qr-scanner";
import { useEffect, useRef } from "react";

import { Task } from "../../lib/task";

export const QrScanner = ({
  onScan,
}: {
  onScan: (scanner: QrScannerClient.ScanResult) => void;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current === null) return;
    const scanner = new QrScannerClient(ref.current, onScan, {
      highlightCodeOutline: true,
      highlightScanRegion: true,
    });

    const task = new Task();
    task.pipe(() => scanner.start());
    task.pipe(() => ref.current?.classList.remove("animate-pulse"));
    return () => task.pipe(() => scanner.destroy());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      className="aspect-square w-full animate-pulse rounded-2xl bg-zinc-100 object-cover"
      ref={ref}
    ></video>
  );
};
