import { Map as MapboxMap, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import { useGeolocation } from "~/hook/base/useGeolocation";
import { LocationPuck } from "~/ui/base/LocationPuck";

export const Map = ({
  height,
  position,
  showCurrentPosition,
  width,
}: {
  height: number;
  position: Pick<GeolocationPosition["coords"], "latitude" | "longitude">;
  showCurrentPosition?: boolean;
  width: number;
}) => {
  const currentPosition = useGeolocation({ suspense: true }).data;

  return (
    currentPosition && (
      <MapboxMap
        initialViewState={{
          latitude: position.latitude,
          longitude: position.longitude,
          zoom: 13,
        }}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ height, width }}
      >
        <Marker latitude={position.latitude} longitude={position.longitude}>
          <span className="text-5xl">📍</span>
        </Marker>
        {showCurrentPosition && (
          <Marker
            latitude={currentPosition.coords.latitude}
            longitude={currentPosition.coords.longitude}
          >
            <LocationPuck />
          </Marker>
        )}
      </MapboxMap>
    )
  );
};
