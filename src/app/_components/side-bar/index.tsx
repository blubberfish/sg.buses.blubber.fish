"use client";
import { DashboardHeader } from "@/lib/components/dashboard/header";
import { XIcon as X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { type PropsWithChildren } from "react";
import { SideBarButton } from "./button";

export function SideBar({ children }: PropsWithChildren) {
  const search = useSearchParams();
  const enabled = search.get("sideBar") === "1";

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 bg-white/13 backdrop-blur grid grid-cols-1 grid-rows-1 justify-items-end">
      <div id="sb-0" className="max-w-sm w-full bg-slate-700">
        <DashboardHeader>
          <div className="flex-1"></div>
          <nav className="mr-9">
            <SideBarButton href="?sideBar=0">
              <X className="size-4" />
            </SideBarButton>
          </nav>
        </DashboardHeader>
        {children}
      </div>
    </div>
  );
}
