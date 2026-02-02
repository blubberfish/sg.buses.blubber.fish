import { type PropsWithChildren } from "react";

export function Card({
  children,
  skeleton,
}: PropsWithChildren<{ skeleton?: boolean }>) {
  return (
    <div
      className={`my-3 p-3 rounded ${
        !skeleton ? "bg-gray-800" : "bg-neutral-400 animate-pulse"
      }`}
    >
      {children}
    </div>
  );
}
