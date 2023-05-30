import useSWRMutation from "swr/mutation";
import { useUser } from "../component/Auth";
import { Navigation } from "../component/Navigation";
import { yogiPokeApi } from "../service/api";
import { DomainBottomNavigation } from "./MyPage";
import { useNotification } from "../component/Notification";
import { AxiosError } from "axios";
import { useState } from "react";

export const Search = () => {
  const push = useNotification();
  const [email, setEmail] = useState("");
  const { assertAuth } = useUser();
  assertAuth();

  const { trigger, isMutating } = useSWRMutation(
    "/mate/poke",
    (key, { arg }: { arg: { email: string } }) => yogiPokeApi.post(key, arg),
    {
      onError: (err: AxiosError) =>
        err.response?.status === 404
          ? push({ content: "존재하지 않는 유저입니다!" })
          : push({ content: "다시 시도해주세요." }),
    }
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="p-5">
        <p className="pt-52 text-2xl font-bold text-zinc-800">
          누구를 콕콕! 찌를까요?
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            trigger({ email });
          }}
        >
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
          <div className="flex justify-end pt-9">
            <button
              className="rounded-full bg-black p-3 text-white active:opacity-60 disabled:bg-zinc-300"
              disabled={isMutating}
            >
              콕 찌르기 👉
            </button>
          </div>
        </form>
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
