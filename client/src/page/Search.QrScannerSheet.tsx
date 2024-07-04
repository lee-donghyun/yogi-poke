import { lazy, Suspense } from "react";
import { useRouter } from "router2";

import { createDraggableSheet } from "../component/StackedLayerProvider";

const QrScanner = lazy(() =>
  import("../component/QrScanner").then((mod) => ({ default: mod.QrScanner })),
);

export const QrScannerSheet = createDraggableSheet(({ close }) => {
  const { navigate } = useRouter();

  const onScan: Parameters<typeof QrScanner>[0]["onScan"] = (scanner) => {
    const email = scanner.data.split("https://yogi-poke.vercel.app/me/")[1];
    if (typeof email !== "string") return;
    close();
    navigate({ pathname: "/search", query: { email } }, { replace: true });
  };

  return (
    <div className="p-5 pb-32">
      <p className="text-lg font-semibold text-zinc-800">QR 코드 스캔</p>
      <p className="pt-3 text-zinc-600">
        상대방의 QR 코드를 스캔하여 콕콕! 찌를 수 있어요.
      </p>
      <div className="pt-7"></div>
      <Suspense
        fallback={
          <div className="aspect-square w-full animate-pulse rounded-md bg-zinc-100"></div>
        }
      >
        <QrScanner onScan={onScan} />
      </Suspense>
    </div>
  );
});
