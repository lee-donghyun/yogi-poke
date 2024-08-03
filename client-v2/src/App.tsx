import { PwaProvider } from "./component/provider/pwa-provider";

export const App = () => {
  return (
    <PwaProvider>
      {({ prefetch }) => <div>{JSON.stringify(prefetch)}dfd</div>}
    </PwaProvider>
  );
};
