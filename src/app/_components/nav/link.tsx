"use client";

import { usePathname } from "next/navigation";
import React from "react";

export function Link({
  children,
  path,
}: React.PropsWithChildren<{ path: string }>) {
  const activePath = usePathname().startsWith(path);

  return (
    <a
      className={`p-1 -mb-[1px] border-b ${
        activePath
          ? "border-b-emerald-300 text-emerald-400"
          : "border-b-transparent text-current"
      }`}
      href={path}
    >
      <span className="px-2 p-1 rounded hover:bg-white/15">{children}</span>
    </a>
  );
}
