import { Map as MapboxMap, Marker } from "react-map-gl";
import useSWR from "swr";
import "mapbox-gl/dist/mapbox-gl.css";

export const Map = ({ height, width }: { height: number; width: number }) => {
  const { data: position } = useSWR(
    "geolocation",
    () =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }),
    {
      suspense: true,
    },
  );

  return (
    position && (
      <MapboxMap
        initialViewState={{
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 12,
        }}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ height, width }}
      >
        <Marker
          latitude={position.coords.latitude}
          longitude={position.coords.longitude}
        >
          <span className="text-5xl">📍</span>
        </Marker>
      </MapboxMap>
    )
  );
};
