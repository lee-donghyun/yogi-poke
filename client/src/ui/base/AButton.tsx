import { ButtonHTMLAttributes, useTransition } from "react";

type AButtonProps = {
  onClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "onClick">;

export const AButton = ({ onClick, ...props }: AButtonProps) => {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      {...props}
      disabled={isPending}
      onClick={(e) => startTransition(() => onClick(e))}
    />
  );
};
