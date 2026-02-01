import { HTMLAttributes } from "react";

export function DashboardContainer(props: HTMLAttributes<HTMLDivElement>) {
  return <div className="w-screen min-h-svh" {...props} />;
}
