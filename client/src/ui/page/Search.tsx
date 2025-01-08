import { Trans, useLingui } from "@lingui/react/macro";
import { MouseEventHandler, useState } from "react";
import { useRouter } from "router2";
import useSWR from "swr";

import { useCreatedAt } from "../../hook/base/useCreatedAt.ts";
import { useDebouncedValue } from "../../hook/base/useDebouncedValue.ts";
import { usePoke } from "../../hook/domain/usePoke.ts";
import { User } from "../../service/dataType.ts";
import { isVerifiedUser } from "../../service/util.ts";
import { Navigation } from "../base/Navigation.tsx";
import { DomainBottomNavigation } from "../domain/DomainBottomNavigation.tsx";
import { PokeWithDrawing } from "../domain/PokeWithDrawing.tsx";
import { PokeWithEmoji } from "../domain/PokeWithEmoji.tsx";
import { PokeWithGeoLocation } from "../domain/PokeWithGeolocation.tsx";
import { UserListItem } from "../domain/UserListItem.tsx";
import { CircleXIcon } from "../icon/CircleX.tsx";
import { QrCode } from "../icon/QrCode.tsx";
import { useAuthNavigator } from "../provider/Auth.tsx";
import { Layer, useStackedLayer } from "../provider/StackedLayerProvider.tsx";
import { QrScannerSheet } from "./Search.QrScannerSheet.tsx";

const cx = {
  animatedPokeOptionButton: "absolute right-0",
  hiddenAnimatedPokeOptionButton: "translate-x-1/4 scale-x-50 opacity-0",
  pokeOptionButton:
    "whitespace-pre rounded-full bg-black px-4 py-3 font-medium text-white duration-300 active:bg-zinc-300 disabled:bg-zinc-300",
};

export const Search = () => {
  useAuthNavigator({ goToAuth: "/sign-in" });
  const overlay = useStackedLayer();
  const { t } = useLingui();
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

  const validateAndOverlay =
    (Sheet: Layer<{ email: string }>): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      if (e.target !== e.currentTarget) {
        return;
      }
      if (typeof selected?.email !== "string") {
        return;
      }
      overlay(Sheet, { email: selected.email });
    };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="p-5">
        <div className="flex justify-between pt-32">
          <p className="text-2xl font-bold text-zinc-800">
            <Trans>누구를 콕콕! 찌를까요?</Trans>
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
            placeholder={t`이름 또는 아이디로 검색해요`}
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
                <Trans>유저를 찾지 못했어요.</Trans>
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-[calc(128px+max(1.25rem,env(safe-area-inset-bottom)))] right-5">
        <button
          className={`${pokeOptionOpen ? "" : `${cx.hiddenAnimatedPokeOptionButton} translate-y-[10.5rem]`} bottom-[10.5rem] ${cx.pokeOptionButton} ${cx.animatedPokeOptionButton}`}
          onClick={validateAndOverlay(PokeWithDrawing)}
          type="button"
        >
          <Trans>그림 찌르기</Trans> 🎨
        </button>
        <button
          className={`${pokeOptionOpen ? "" : `${cx.hiddenAnimatedPokeOptionButton} translate-y-28`} bottom-28 ${cx.pokeOptionButton} ${cx.animatedPokeOptionButton}`}
          onClick={validateAndOverlay(PokeWithGeoLocation)}
          type="button"
        >
          <Trans>내 위치 찌르기</Trans> 📍
        </button>
        <button
          className={`${pokeOptionOpen ? "" : `${cx.hiddenAnimatedPokeOptionButton} translate-y-14`} bottom-14 ${cx.pokeOptionButton} ${cx.animatedPokeOptionButton}`}
          onClick={validateAndOverlay(PokeWithEmoji)}
          type="button"
        >
          <Trans>이모티콘 찌르기</Trans> 😊
        </button>
        <button
          className={`${pokeOptionOpen ? "w-36" : "w-28"} relative overflow-hidden ${cx.pokeOptionButton}`}
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
          {pokeOptionOpen && <Trans>바로 콕 찌르기</Trans>}
          {!pokeOptionOpen && <Trans>콕 찌르기</Trans>}
          {" 👉"}
        </button>
      </div>
      <DomainBottomNavigation />
    </div>
  );
};
