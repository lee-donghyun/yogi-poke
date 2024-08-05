import QrScannerClient from "qr-scanner";
import { useEffect, useRef } from "react";

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
    const startScanning = scanner.start();
    void startScanning.then(() => {
      ref.current?.classList.remove("animate-pulse");
    });
    return () => {
      void startScanning.finally(() => {
        scanner.destroy();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <video
      className="aspect-square w-full animate-pulse rounded-md bg-zinc-100 object-cover"
      ref={ref}
    ></video>
  );
};
