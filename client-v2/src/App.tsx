import { PwaProvider } from "./component/provider/pwa-provider";

export const App = () => {
  return (
    <PwaProvider>
      {(props) => <div>{JSON.stringify(props.myInfo)}dfd</div>}
    </PwaProvider>
  );
};
