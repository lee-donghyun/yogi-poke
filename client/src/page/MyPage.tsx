import { useUser } from "../component/Auth";

export const MyPage = () => {
  const { assertAuth } = useUser();
  assertAuth();
  return (
    <div>
      <h1>im logged in!</h1>
    </div>
  );
};
