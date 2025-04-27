import { lazy, Suspense } from "react";
import { BrowserRouter } from "router2";

import { config, routes } from "~/service/router.ts";
import { BACKDROP_ANIMATION_DURATION } from "~/ui/base/Backdrop.tsx";
import { AuthProvider } from "~/ui/provider/Auth.tsx";
import { I18nProvider } from "~/ui/provider/I18nProvider.tsx";
import { MessageProvider } from "~/ui/provider/Message.tsx";
import { NotificationProvider } from "~/ui/provider/Notification.tsx";
import { PwaProvider } from "~/ui/provider/PwaProvider.tsx";
import { StackedLayerProvider } from "~/ui/provider/StackedLayerProvider.tsx";

const Introduction = lazy(() =>
  import("~/ui/page/Introduction.tsx").then((mod) => ({
    default: mod.Introduction,
  })),
);
// hello!
export const App = () => {
  return (
    <BrowserRouter config={config} routes={routes}>
      {(Page) => (
        <I18nProvider>
          <NotificationProvider>
            <PwaProvider
              fallback={
                <StackedLayerProvider
                  unmountAfter={BACKDROP_ANIMATION_DURATION}
                >
                  <Suspense>
                    <Introduction />
                  </Suspense>
                </StackedLayerProvider>
              }
            >
              {(prefetch) => (
                <AuthProvider myInfo={prefetch.myInfo}>
                  <MessageProvider>
                    <StackedLayerProvider
                      unmountAfter={BACKDROP_ANIMATION_DURATION}
                    >
                      <Page />
                    </StackedLayerProvider>
                  </MessageProvider>
                </AuthProvider>
              )}
            </PwaProvider>
          </NotificationProvider>
        </I18nProvider>
      )}
    </BrowserRouter>
  );
};
