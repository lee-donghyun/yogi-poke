import { Trans, useLingui } from "@lingui/react/macro";
import { MouseEventHandler, useState } from "react";
import { useRouter } from "router2";

import { useDebouncedValue } from "../../hook/base/useDebouncedValue.ts";
import { usePoke } from "../../hook/domain/usePoke.ts";
import { User } from "../../service/dataType.ts";
import { dataUpdatedAtMiddleware } from "../../service/swr/middleware.dataUpdatedAt.ts";
import { createShouldAnimateMiddleware } from "../../service/swr/middleware.shouldAnimate.ts";
import { useSWRMiddleware } from "../../service/swr/middleware.ts";
import { isVerifiedUser } from "../../service/util.ts";
import { Navigation } from "../base/Navigation.tsx";
import { DomainBottomNavigation } from "../domain/DomainBottomNavigation.tsx";
import { UserListItem } from "../domain/UserListItem.tsx";
import { CircleXIcon } from "../icon/CircleX.tsx";
import { QrCode } from "../icon/QrCode.tsx";
import { PokeWithDrawingSheet } from "../overlay/PokeWithDrawingSheet.tsx";
import { PokeWithEmojiSheet } from "../overlay/PokeWithEmojiSheet.tsx";
import { PokeWithGeoLocationSheet } from "../overlay/PokeWithGeolocationSheet.tsx";
import { QrScannerSheet } from "../overlay/QrScannerSheet.tsx";
import { useAuthNavigator } from "../provider/Auth.tsx";
import { Layer, useStackedLayer } from "../provider/StackedLayerProvider.tsx";

const cx = {
  // eslint-disable-next-line lingui/no-unlocalized-strings
  animatedPokeOptionButton: "absolute right-0",
  // eslint-disable-next-line lingui/no-unlocalized-strings
  hiddenAnimatedPokeOptionButton: "translate-x-1/4 scale-x-50 opacity-0",
  pokeOptionButton:
    // eslint-disable-next-line lingui/no-unlocalized-strings
    "whitespace-pre rounded-full bg-black px-4 py-3 font-medium text-white duration-300 active:bg-zinc-300 disabled:bg-zinc-300",
};

const SEARCH_TEXT_KEY = "q";

type Key = [string, { email: string; limit: number; name: string }];

const isEqualKey = (a: Key, b: Key) =>
  a[1].email === b[1].email && a[1].name === b[1].name;

const middlewares = [
  createShouldAnimateMiddleware(isEqualKey),
  dataUpdatedAtMiddleware,
];

export const Search = () => {
  useAuthNavigator({ goToAuth: "/sign-in" });
  const overlay = useStackedLayer();
  const { t } = useLingui();
  const { params, replace } = useRouter();

  const searchText = params?.[SEARCH_TEXT_KEY] ?? "";
  const setSearchText = (searchText: string) => {
    replace({
      pathname: "/search",
      ...(searchText && { query: { [SEARCH_TEXT_KEY]: searchText } }),
    });
  };
  const deferredSearchText = useDebouncedValue(searchText, 300);
  const [selected, setSelected] = useState<null | User>(null);

  const { data, dataUpdatedAt, isLoading, shouldAnimate } = useSWRMiddleware<
    User[],
    typeof middlewares,
    Key
  >(
    ["user", { email: deferredSearchText, limit: 5, name: deferredSearchText }],
    {
      keepPreviousData: true,
      onSuccess: () => {
        setSelected(null);
        setPokeOptionOpen(false);
      },
      use: middlewares,
    },
  );

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
    <div className="min-h-dvh">
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
            autoCapitalize="off"
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
              animation={shouldAnimate ? { delayTimes: i } : null}
              isVerifiedUser={isVerifiedUser(user)}
              key={user.email + dataUpdatedAt} // data 변경 시 애니메이션을 위해 dataUpdatedAt 추가
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
          onClick={validateAndOverlay(PokeWithDrawingSheet)}
          type="button"
        >
          <Trans>그림 찌르기</Trans> 🎨
        </button>
        <button
          className={`${pokeOptionOpen ? "" : `${cx.hiddenAnimatedPokeOptionButton} translate-y-28`} bottom-28 ${cx.pokeOptionButton} ${cx.animatedPokeOptionButton}`}
          onClick={validateAndOverlay(PokeWithGeoLocationSheet)}
          type="button"
        >
          <Trans>내 위치 찌르기</Trans> 📍
        </button>
        <button
          className={`${pokeOptionOpen ? "" : `${cx.hiddenAnimatedPokeOptionButton} translate-y-14`} bottom-14 ${cx.pokeOptionButton} ${cx.animatedPokeOptionButton}`}
          onClick={validateAndOverlay(PokeWithEmojiSheet)}
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
