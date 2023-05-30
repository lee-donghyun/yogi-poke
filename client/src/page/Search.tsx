import useSWRMutation from "swr/mutation";
import { useUser } from "../component/Auth";
import { Navigation } from "../component/Navigation";
import { yogiPokeApi } from "../service/api";
import { DomainBottomNavigation } from "./MyPage";
import { useNotification } from "../component/Notification";
import { AxiosError } from "axios";
import { useState } from "react";
import useSWR from "swr";
import { UserListItem } from "../component/UserListItem";
import { useDebouncedValue } from "../hook/useDebouncedValue";
import { validator } from "../service/validator";

type User = {
  email: string;
  id: number;
  name: string;
  profileImageUrl?: string;
};

export const Search = () => {
  const push = useNotification();
  const { assertAuth } = useUser();
  assertAuth();

  const [email, setEmail] = useState("");
  const deferredEmail = useDebouncedValue(email, 300);
  const [selectedEmail, setSelectedEmail] = useState<null | string>(null);

  const { data, isLoading } = useSWR<User[]>(
    deferredEmail.length === 0 || validator.email(deferredEmail) === null
      ? ["/user", { email: deferredEmail, limit: 5 }]
      : [],
    {
      keepPreviousData: true,
      onSuccess: (users) => {
        users.every((user) => user.email !== selectedEmail) &&
          setSelectedEmail(null);
      },
    }
  );

  const { trigger, isMutating } = useSWRMutation(
    "/mate/poke",
    (key, { arg }: { arg: { email: string } }) => yogiPokeApi.post(key, arg),
    {
      onError: (err: AxiosError) =>
        err.response?.status === 404
          ? push({ content: "존재하지 않는 유저입니다!" })
          : push({ content: "다시 시도해주세요." }),
      onSuccess: () => {
        push({ content: "콕 찌르기 성공!" });
      },
    }
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="p-5">
        <p className="pt-52 text-2xl font-bold text-zinc-800">
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
        <div className="mt-5 flex flex-col">
          {data?.map((user, i) => (
            <UserListItem
              key={user.email}
              listIndex={i}
              onClick={() => setSelectedEmail(user.email)}
              selected={selectedEmail === user.email}
              userEmail={user.email}
              userName={user.name}
            />
          )) ?? <div style={{ height: 180 }} />}
        </div>
        <div className="flex justify-end pt-9">
          <button
            className="rounded-full bg-black p-3 text-white active:opacity-60 disabled:bg-zinc-300"
            disabled={selectedEmail === null || isLoading || isMutating}
            onClick={() =>
              typeof selectedEmail === "string" &&
              trigger({ email: selectedEmail })
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
