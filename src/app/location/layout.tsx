import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 auto-rows-min max-h-[calc(100dvh-theme(spacing.16))]">
      {children}
    </div>
  );
}
