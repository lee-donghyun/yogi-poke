import { Trans } from "@lingui/react/macro";
import { lazy, Suspense, useRef } from "react";
import { useRouter } from "router2";

import { createDraggableSheet } from "~/ui/base/DraggableSheet.tsx";

const QrScanner = lazy(() =>
  import("~/ui//base/QrScanner.tsx").then((mod) => ({
    default: mod.QrScanner,
  })),
);

export const QrScannerSheet = createDraggableSheet(
  ({ close, descriptionId, titleId }) => {
    const { push } = useRouter();

    const navigatedRef = useRef(false);

    const onScan: Parameters<typeof QrScanner>[0]["onScan"] = (scanner) => {
      const email = scanner.data.split("https://yogi-poke.vercel.app/me/")[1];
      if (typeof email !== "string" || navigatedRef.current) return;
      navigatedRef.current = true;
      close();
      push({ pathname: `/user/${email}` });
    };

    return (
      <div className="p-6 pt-2.5">
        <h1 className="text-lg font-semibold text-zinc-800" id={titleId}>
          <Trans>QR 코드 스캔</Trans>
        </h1>
        <p className="pt-3 pb-6 text-sm text-zinc-400" id={descriptionId}>
          <Trans>상대방의 QR 코드를 스캔하여 콕콕! 찌를 수 있어요.</Trans>
        </p>
        <Suspense
          fallback={
            <div className="aspect-square w-full animate-pulse rounded-2xl bg-zinc-100"></div>
          }
        >
          <QrScanner onScan={onScan} />
        </Suspense>
      </div>
    );
  },
);
