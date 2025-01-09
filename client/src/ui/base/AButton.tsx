import { ButtonHTMLAttributes, useState } from "react";

type AButtonProps = {
  onClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "onClick">;

/**
 * 비동기 onClick을 지원하는 버튼 컴포넌트입니다.
 * 해당 컴포넌트는 에러 핸들링을 해주지 않습니다. 콜백에서 직접 처리합니다.
 */
export const AButton = ({ onClick, ...props }: AButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPending(true);
    await onClick(e);
    setIsPending(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return <button {...props} disabled={isPending} onClick={handleClick} />;
};
