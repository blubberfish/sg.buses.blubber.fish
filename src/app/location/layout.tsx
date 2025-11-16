import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <div className="w-full max-w-5xl mx-auto">{children}</div>;
}
