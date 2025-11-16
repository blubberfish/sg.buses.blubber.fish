import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <div className="flex flex-col py-0 sm:py-9">{children}</div>;
}
