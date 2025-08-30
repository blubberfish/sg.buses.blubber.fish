import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <header className="h-16 from-emerald-400 to-violet-600 bg-linear-to-br rounded-b-lg">
      {children}
    </header>
  );
}
