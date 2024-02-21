import React, {
  AnchorHTMLAttributes,
  createContext,
  DetailedHTMLProps,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface History {
  pathname: string;
  query?: Record<string, string>;
}

interface RouterProps {
  routes: Record<string, () => JSX.Element> & Record<"/404", () => JSX.Element>;
  children?: (Page: () => JSX.Element) => JSX.Element;
}

interface Router {
  path: string | undefined;
  navigate: (
    history: History,
    options?: {
      replace?: boolean;
    },
  ) => void;
  pathname: string;
  params: Record<string, string>;
}

if (window.location.pathname.endsWith("/")) {
  history.replaceState(undefined, "", window.location.pathname.slice(0, -1));
}
const initialHistory: History = {
  pathname: window.location.pathname,
  query: window.location.search
    ? Object.fromEntries(new URLSearchParams(window.location.search).entries())
    : undefined,
};

const historyContext = createContext<History>(initialHistory);
const setHistoryContext = createContext<Dispatch<SetStateAction<History>>>(
  () => {
    throw new Error("setHistoryContext");
  },
);
const routerContext = createContext<Router>({} as Router);

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [history, setHistory] = useState<History>(initialHistory);
  return (
    <historyContext.Provider value={history}>
      <setHistoryContext.Provider value={setHistory}>
        {children}
      </setHistoryContext.Provider>
    </historyContext.Provider>
  );
};

const EventListener = ({ children }: { children: React.ReactNode }) => {
  const setHistory = useContext(setHistoryContext);
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      setHistory((e.state as History | undefined) ?? initialHistory);
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
};

const Router = ({ routes, children: chidren }: RouterProps) => {
  const { pathname } = useContext(historyContext);
  const [path, Page] = Object.entries(routes)
    .sort((a, b) => (a[0] > b[0] ? -1 : 1))
    .find(([path]) => matchDynamicRoute(path, pathname)) ?? [
    "",
    routes["/404"],
  ];
  const router = useCreateSingletonRouter(path);
  return (
    <routerContext.Provider value={router}>
      {chidren ? chidren(Page) : <Page />}
    </routerContext.Provider>
  );
};

export const BrowserRouter = ({ ...props }: RouterProps) => {
  return (
    <Provider>
      <EventListener>
        <Router {...props} />
      </EventListener>
    </Provider>
  );
};

export const Link = ({
  pathname,
  query,
  replace,
  ...anchorProps
}: History & { replace?: boolean } & Omit<
    DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    "href"
  >) => {
  const url = query
    ? `${pathname}?${new URLSearchParams(query).toString()}`
    : pathname;
  const router = useRouter();
  return (
    <a
      {...anchorProps}
      href={url}
      onClick={(e) => {
        e.preventDefault();
        router.navigate({ pathname, query }, { replace });
        anchorProps.onClick?.(e);
      }}
    />
  );
};

const matchDynamicRoute = (path: string, pathname: string) => {
  if (path.includes("/:")) {
    const pathes = path.split("/");
    const pathnames = pathname.split("/");
    return (
      pathes.length === pathnames.length &&
      pathnames.every((v, i) => v === pathes[i] || pathes[i].startsWith(":"))
    );
  }
  return path === pathname;
};

const useCreateSingletonRouter = (path: string | undefined) => {
  const history = useContext(historyContext);
  const setHistory = useContext(setHistoryContext);
  const navigate = (history: History, options?: { replace?: boolean }) => {
    const url = history.query
      ? `${history.pathname}?${new URLSearchParams(history.query).toString()}`
      : history.pathname;
    setHistory(history);
    options?.replace
      ? window.history.replaceState(history, "", url)
      : window.history.pushState(history, "", url);
  };
  const getParams = () => {
    const pathParams = path
      ?.split("/")
      .map((path, index) => [path, index] as const)
      .filter(([path]) => path.startsWith(":"));
    const pathnames = history.pathname.split("/");
    return {
      ...history.query,
      ...Object.fromEntries(
        pathParams?.map(([path, index]) => [path, pathnames[index]]) ?? [],
      ),
    };
  };
  return {
    path,
    navigate,
    pathname: history.pathname,
    params: getParams(),
  };
};

export const useRouter = () => useContext(routerContext);
