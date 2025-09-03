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
      } flex flex-row flex-nowrap items-center p-1`}
      href={path}
    >
      {children}
    </a>
  );
}
