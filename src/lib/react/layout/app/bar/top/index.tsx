import { PropsWithChildren } from "react";

export function TopBar({
  children,
  className = (css) => css,
}: PropsWithChildren<{ className?: { (css: string): string } }>) {
  return <div className={className("h-16 px-9")}>{children}</div>;
}
