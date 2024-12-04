/**
 * Baseweb LocationPuck component의 tailwindcss port 입니다.
 * @see https://github.com/uber/baseweb/blob/main/src/map-marker/location-puck.tsx
 */

export const LocationPuck = ({
  confidenceRadius,
}: {
  confidenceRadius: number;
}) => {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute rounded-full bg-blue-500 opacity-10 transition-all"
        style={{ height: confidenceRadius * 2, width: confidenceRadius * 2 }}
      ></div>
      <div className="absolute h-3 w-3 rounded-full bg-blue-500 shadow-lg"></div>
    </div>
  );
};
