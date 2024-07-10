import { HTMLProps, useState } from "react";

enum ImageStatus {
  LOADING,
  ERROR,
  LOADED,
}

export const Img = ({
  className,
  ...props
}: { src: string } & HTMLProps<HTMLImageElement>) => {
  const [status, setStatus] = useState<ImageStatus>(ImageStatus.LOADING);
  return (
    <img
      {...props}
      className={`${status == ImageStatus.LOADED ? "opacity-100" : "opacity-0"} duration-75 ${className ?? ""}`}
      onLoad={() => setStatus(ImageStatus.LOADED)}
    />
  );
};
