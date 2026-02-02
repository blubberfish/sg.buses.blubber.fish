import { type PropsWithChildren } from "react";

export function ResultsSection({ children }: PropsWithChildren) {
  return <section className="container mx-auto px-9 my-6">{children}</section>;
}
