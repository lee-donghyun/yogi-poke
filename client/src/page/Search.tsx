import QrScanner from "qr-scanner";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "router2";
import useSWR from "swr";

import { useUser } from "../component/Auth";
import { DomainBottomNavigation } from "../component/BottomNavigation.DomainBottomNavigation";
import { CircleXIcon } from "../component/icon/CircleX";
import { QrCode } from "../component/icon/QrCode";
import { Navigation } from "../component/Navigation";
import {
  createDraggableSheet,
  useStackedLayer,
} from "../component/StackedLayerProvider";
import { UserListItem } from "../component/UserListItem";
import { useCreatedAt } from "../hook/useCreatedAt";
import { useDebouncedValue } from "../hook/useDebouncedValue";
import { usePoke } from "../hook/usePoke";
import { User } from "../service/dataType";
import { eventPokeProps } from "../service/event/firstFive";
import { validator } from "../service/validator";

const QrScannerSheet = createDraggableSheet(({ close }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const { navigate } = useRouter();

  useEffect(() => {
    if (ref.current === null) return;
    const scanner = new QrScanner(
      ref.current,
      (scanner) => {
        const email = scanner.data.split("https://yogi-poke.vercel.app/me/")[1];
        if (typeof email !== "string") return;
        close();
        navigate({ pathname: "/search", query: { email } }, { replace: true });
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      },
    );
    const startScanning = scanner.start();
    return () => {
      void startScanning.finally(() => {
        scanner.destroy();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-5 pb-32">
      <p className="text-lg font-semibold text-zinc-800">QR 코드 스캔</p>
      <p className="pt-3 text-zinc-600">
        상대방의 QR 코드를 스캔하여 콕콕! 찌를 수 있어요.
      </p>
      <div className="pt-7"></div>
      <video
        ref={ref}
        className="aspect-square w-full rounded-md bg-zinc-100 object-cover"
      ></video>
    </div>
  );
});

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

  const { trigger, isMutating } = usePoke(eventPokeProps);

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
          <button
            className="rounded-full bg-black p-3 text-white active:opacity-60 disabled:bg-zinc-300"
            disabled={selected === null || isLoading || isMutating}
            onClick={() =>
              typeof selected?.email === "string" &&
              void trigger({ email: selected.email }).then(() => {
                setSelected(null);
              })
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
