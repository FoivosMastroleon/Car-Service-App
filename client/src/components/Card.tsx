import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

const Card = ({ children, className = "", onClick }: Props) => {
  const interactive = onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : "";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 transition-all duration-150 ${interactive} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
