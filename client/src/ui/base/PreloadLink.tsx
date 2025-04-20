import { KyInstance } from "ky";
import { ReactNode } from "react";
import { getParams, Link, matchDynamicRoute } from "router2";
import { Router } from "router2/lib/types";

import { useIntersectionObserver } from "~/hook/base/useIntersectionObserver";
import { routes } from "~/service/router";
import { memoize } from "~/service/util";
import { useUser } from "~/ui/provider/Auth";

export type PreloadablePage = (() => ReactNode) & {
  preload?: (
    history: Pick<Router, "params" | "path" | "pathname">,
    client: KyInstance,
  ) => Promise<void>;
};

const getRoute = memoize((pathname: string) => {
  return (Object.entries(routes)
    .sort((a, b) => (a[0] > b[0] ? -1 : 1))
    .find(([path]) => matchDynamicRoute(path, pathname)) ?? [
    undefined,
    routes["/404"],
  ]) as [string, PreloadablePage];
});

export const PreloadLink = (props: Parameters<typeof Link>[0]) => {
  const { pathname, query } = props;

  const { client } = useUser();

  const [path, Page] = getRoute(pathname);

  const params = getParams({ pathname, query }, path);

  const observer = useIntersectionObserver<HTMLAnchorElement>(() => {
    void Page?.preload?.({ params, path, pathname }, client);
  });

  return <Link {...props} ref={observer} />;
};
