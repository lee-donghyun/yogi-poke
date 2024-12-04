import { ReactNode } from "react";
import useSWR, { SWRConfiguration } from "swr";

export const useGeoLocation = (options?: Pick<SWRConfiguration, "suspense">) =>
  useSWR(
    "geolocation",
    () =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }),
    options,
  ).data;

export const GeolocationConsumer = ({
  children,
}: {
  children: (position: GeolocationPosition | undefined) => ReactNode;
}) => {
  return children(useGeoLocation({ suspense: true }));
};
