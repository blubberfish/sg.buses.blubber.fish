"use client";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { TopAction } from "../top/button";

export function ShowSideBarAction() {
  const router = useRouter();
  return (
    <TopAction
      aria-label="show sidebar"
      onClick={() => {
        const url = new URL(document.location.href);
        url.searchParams.set("sideBar", "");
        router.replace(url.href);
      }}
    >
      <Menu />
    </TopAction>
  );
}
