import { PropsWithChildren } from "react";

export function Section({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <section className="mx-3 mt-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </section>
  );
}
