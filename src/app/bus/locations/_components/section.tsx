import { PropsWithChildren } from "react";

export function Section({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <section>
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </section>
  );
}
