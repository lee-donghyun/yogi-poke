import { useUser } from "../component/Auth";
import { Navigation } from "../component/Navigation";
import { DomainBottomNavigation } from "./MyPage";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { UserListItem } from "../component/UserListItem";
import { useDebouncedValue } from "../hook/useDebouncedValue";
import { validator } from "../service/validator";
import { usePoke } from "../hook/usePoke";

type User = {
  email: string;
  id: number;
  name: string;
  profileImageUrl?: string;
};

export const Search = () => {
  const { assertAuth } = useUser();
  assertAuth();

  const [email, setEmail] = useState("");
  const deferredEmail = useDebouncedValue(email, 300);
  const [selected, setSelected] = useState<null | User>(null);

  const { data, isLoading } = useSWR<User[]>(
    deferredEmail.length === 0 || validator.email(deferredEmail) === null
      ? ["/user", { email: deferredEmail, limit: 5 }]
      : [],
    {
      keepPreviousData: true,
      onSuccess: () => {
        setSelected(null);
      },
    }
  );
  const dataUpdatedAt = useMemo(() => Date.now(), [data]);

  const { trigger, isMutating } = usePoke();

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="p-5">
        <p className="pt-32 text-2xl font-bold text-zinc-800">
          누구를 콕콕! 찌를까요?
        </p>
        <div className="flex items-center pt-10">
          <span className="block w-5 text-xl font-bold">@</span>
          <input
            className="flex-1 rounded-none border-b-2 border-black py-2 text-xl font-bold outline-none placeholder:font-normal"
            onChange={({ target: { value } }) => setEmail(value)}
            placeholder="콕콕! 찌를 상대방의 아이디를 입력하세요!"
            type="text"
            value={email}
          />
        </div>
        <div className="mt-5 flex flex-col" style={{ height: 300 }}>
          {data?.map((user, i) => (
            <UserListItem
              key={user.email + dataUpdatedAt}
              listIndex={i}
              onClick={() => setSelected(user)}
              selected={selected?.email === user.email}
              userEmail={user.email}
              userName={user.name}
            />
          ))}
        </div>
        <div className="flex justify-end pt-9">
          <button
            className="rounded-full bg-black p-3 text-white active:opacity-60 disabled:bg-zinc-300"
            disabled={selected === null || isLoading || isMutating}
            onClick={() =>
              typeof selected?.email === "string" &&
              trigger({ email: selected.email }).then(() => setSelected(null))
            }
          >
            콕 찌르기 👉
          </button>
        </div>
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
