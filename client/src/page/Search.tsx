import { useState } from "react";
import { useRouter } from "router2";
import useSWR from "swr";

import { useUser } from "../component/Auth";
import { DomainBottomNavigation } from "../component/BottomNavigation.DomainBottomNavigation";
import { CircleXIcon } from "../component/icon/CircleX";
import { QrCode } from "../component/icon/QrCode";
import { Navigation } from "../component/Navigation";
import { useStackedLayer } from "../component/StackedLayerProvider";
import { UserListItem } from "../component/UserListItem";
import { useCreatedAt } from "../hook/useCreatedAt";
import { useDebouncedValue } from "../hook/useDebouncedValue";
import { usePoke } from "../hook/usePoke";
import { User } from "../service/dataType";
import { validator } from "../service/validator";
import { QrScannerSheet } from "./Search.QrScannerSheet";

export const Search = () => {
  useUser({ assertAuth: true });
  const overlay = useStackedLayer();
  const { params, navigate } = useRouter();

  const email = params?.email ?? "";
  const setEmail = (email: string) => {
    navigate(
      { pathname: "/search", ...(email && { query: { email } }) },
      { replace: true },
    );
  };
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
    },
  );
  const dataUpdatedAt = useCreatedAt(data);

  const [pokeOptionOpen, setPokeOptionOpen] = useState(false);

  const { trigger, isMutating } = usePoke();

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="p-5">
        <div className="flex justify-between pt-32">
          <p className="text-2xl font-bold text-zinc-800">
            누구를 콕콕! 찌를까요?
          </p>
          <button
            className="text-zinc-500"
            type="button"
            onClick={() => {
              overlay(QrScannerSheet);
            }}
          >
            <QrCode />
          </button>
        </div>
        <div className="flex items-center pt-10">
          <span className="block w-5 text-xl font-bold">@</span>
          <input
            className="flex-1 rounded-none border-b-2 border-black py-2 text-xl font-bold outline-none placeholder:font-normal"
            placeholder="콕콕! 찌를 상대방의 아이디를 입력하세요!"
            type="text"
            value={email}
            onChange={({ target: { value } }) => {
              setEmail(value);
            }}
          />
        </div>
        <div className="mt-5 flex flex-col" style={{ height: 300 }}>
          {data?.map((user, i) => (
            <UserListItem
              key={user.email + dataUpdatedAt}
              animation={{ delayTimes: i }}
              selected={selected?.email === user.email}
              userEmail={user.email}
              userName={user.name}
              userProfileImageUrl={user.profileImageUrl}
              onClick={() => {
                setSelected(user);
              }}
            />
          ))}
          {data?.length === 0 && (
            <div className="from-bottom flex flex-col items-center pt-16 text-zinc-600">
              <span className="text-zinc-400">
                <CircleXIcon />
              </span>
              <p className="pt-6">
                <span className="font-semibold text-zinc-900">
                  @{deferredEmail}
                </span>{" "}
                유저를 찾지 못했어요.
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end pt-9">
          <div className="relative">
            {pokeOptionOpen && (
              <button className="animate-fade-up animate-duration-200 absolute bottom-14 right-0 whitespace-pre rounded-full bg-zinc-900 p-3 text-white ease-out active:bg-zinc-300">
                이모티콘 찌르기 😊
              </button>
            )}
            <button
              className="relative rounded-full bg-black p-3 text-white duration-200 active:bg-zinc-300 disabled:bg-zinc-300"
              disabled={selected === null || isLoading || isMutating}
              onClick={
                pokeOptionOpen
                  ? () =>
                      typeof selected?.email === "string" &&
                      void trigger({ email: selected.email }).then(() => {
                        setSelected(null);
                      })
                  : () => setPokeOptionOpen(true)
              }
            >
              콕 찌르기 👉
            </button>
          </div>
        </div>
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
