import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <header className="h-16 from-emerald-200 to-violet-200 bg-linear-to-br rounded-b-lg">
      {children}
    </header>
  );
}
