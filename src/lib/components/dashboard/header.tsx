import { HTMLAttributes } from "react";

export function DashboardHeader(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="w-full h-16 flex flex-row flex-nowrap items-center justify-between"
      {...props}
    />
  );
}
