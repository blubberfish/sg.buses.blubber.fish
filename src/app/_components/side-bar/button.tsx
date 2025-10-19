"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

export function SideBarButton({
  children = <Menu className="size-4" />,
  href = "?sideBar=1",
}: {
  children?: ReactNode;
  href?: string;
}) {
  return (
    <Link
      className="block -mr-3 p-3 rounded hover:ring-2 hover:ring-blue-300"
      href={href}
    >
      {children}
    </Link>
  );
}
