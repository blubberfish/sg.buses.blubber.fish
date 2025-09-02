"use client";

import { usePathname } from "next/navigation";
import React from "react";

export function Link({ label, path }: { label: string; path: string }) {
  const activePath = usePathname().startsWith(path);

  return (
    <a
      className={`p-1 ${
        activePath ? "text-emerald-300" : "text-white"
      } cursor-pointer`}
      href={path}
    >
      <span className="px-2 p-1 block rounded hover:bg-white/15">{label}</span>
    </a>
  );
}
