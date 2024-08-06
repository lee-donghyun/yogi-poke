import { useState } from "react";
import { useRouter } from "router2";
import useSWR from "swr";

import { useCreatedAt } from "../../hook/base/useCreatedAt.ts";
import { useDebouncedValue } from "../../hook/base/useDebouncedValue.ts";
import { usePoke } from "../../hook/domain/usePoke.ts";
import { isVerifiedUser, User } from "../../service/dataType.ts";
import { Navigation } from "../base/Navigation.tsx";
import { DomainBottomNavigation } from "../domain/DomainBottomNavigation.tsx";
import { UserListItem } from "../domain/UserListItem.tsx";
import { CircleXIcon } from "../icon/CircleX.tsx";
import { QrCode } from "../icon/QrCode.tsx";
import { useUser } from "../provider/Auth.tsx";
import { useStackedLayer } from "../provider/StackedLayerProvider.tsx";
import { PokeWithEmoji } from "./Search.PokeWithEmoji.tsx";
import { QrScannerSheet } from "./Search.QrScannerSheet.tsx";

export const Search = () => {
  useUser({ assertAuth: true });
  const overlay = useStackedLayer();
  const { navigate, params } = useRouter();

  const searchText = params?.searchText ?? "";
  const setSearchText = (searchText: string) => {
    navigate(
      { pathname: "/search", ...(searchText && { query: { searchText } }) },
      { replace: true },
    );
  };
  const deferredSearchText = useDebouncedValue(searchText, 300);
  const [selected, setSelected] = useState<null | User>(null);

  const { data, isLoading } = useSWR<User[]>(
    ["user", { email: deferredSearchText, limit: 5, name: deferredSearchText }],
    {
      keepPreviousData: true,
      onSuccess: () => {
        setSelected(null);
        setPokeOptionOpen(false);
      },
    },
  );
  const dataUpdatedAt = useCreatedAt(data);

  const { isMutating, trigger } = usePoke();

  const [pokeOptionOpen, setPokeOptionOpen] = useState(false);

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
            onClick={() => {
              overlay(QrScannerSheet);
            }}
            type="button"
          >
            <QrCode />
          </button>
        </div>
        <div className="flex items-center pt-10">
          <span className="block w-5 text-xl font-bold">@</span>
          <input
            className="flex-1 rounded-none border-b-2 border-black py-2 text-xl font-bold outline-none placeholder:font-normal"
            onChange={({ target: { value } }) => {
              setSearchText(value);
            }}
            placeholder="이름 또는 아이디로 검색해요"
            type="text"
            value={searchText}
          />
        </div>
        <div className="mt-5 flex flex-col" style={{ height: 300 }}>
          {data?.map((user, i) => (
            <UserListItem
              animation={{ delayTimes: i }}
              isVerifiedUser={isVerifiedUser(user)}
              key={user.email + dataUpdatedAt}
              onClick={() => {
                setSelected(user);
                setPokeOptionOpen(false);
              }}
              selected={selected?.email === user.email}
              userEmail={user.email}
              userName={user.name}
              userProfileImageUrl={user.profileImageUrl}
            />
          ))}
          {data?.length === 0 && (
            <div className="from-bottom flex flex-col items-center pt-16 text-zinc-600">
              <span className="text-zinc-400">
                <CircleXIcon />
              </span>
              <p className="pt-6">
                <span className="font-semibold text-zinc-900">
                  @{deferredSearchText}
                </span>{" "}
                유저를 찾지 못했어요.
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end pt-9">
          <div className="relative">
            <button
              className={`${pokeOptionOpen ? "" : "translate-x-1/4 translate-y-28 scale-x-50 opacity-0"} absolute bottom-28 right-0 whitespace-pre rounded-full bg-black px-4 py-3 font-medium text-white duration-200 active:bg-zinc-300`}
              onClick={(e) => {
                if (e.target !== e.currentTarget) {
                  return;
                }
                if (typeof selected?.email !== "string") {
                  return;
                }
                overlay(PokeWithEmoji, { email: selected.email });
              }}
              type="button"
            >
              그림 찌르기 🎨
            </button>
            <button
              className={`${pokeOptionOpen ? "" : "translate-x-1/4 translate-y-14 scale-x-50 opacity-0"} absolute bottom-14 right-0 whitespace-pre rounded-full bg-black px-4 py-3 font-medium text-white duration-200 active:bg-zinc-300`}
              onClick={(e) => {
                if (e.target !== e.currentTarget) {
                  return;
                }
                if (typeof selected?.email !== "string") {
                  return;
                }
                overlay(PokeWithEmoji, { email: selected.email });
              }}
              type="button"
            >
              이모티콘 찌르기 😊
            </button>
            <button
              className={`${pokeOptionOpen ? "w-36" : "w-28"} relative overflow-hidden whitespace-pre rounded-full bg-black p-3 font-medium text-white duration-200 active:bg-zinc-300 disabled:bg-zinc-300`}
              disabled={selected === null || isLoading || isMutating}
              onClick={(e) => {
                if (e.target !== e.currentTarget) {
                  return;
                }
                if (pokeOptionOpen && typeof selected?.email === "string") {
                  void trigger({
                    email: selected.email,
                    payload: { type: "normal" },
                  }).then(() => {
                    setSelected(null);
                    setPokeOptionOpen(false);
                  });
                  return;
                }
                setPokeOptionOpen(true);
              }}
            >
              {pokeOptionOpen && "바로 "}콕 찌르기 👉
            </button>
          </div>
        </div>
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
