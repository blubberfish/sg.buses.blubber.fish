"use client";

import { XIcon as X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren } from "react";
import { SideBarContainer } from "./container";
import { TopBar } from "../top";
import { TopAction } from "../top/button";

export function SideBar({ children }: PropsWithChildren) {
  const router = useRouter();
  const showSideBar = useSearchParams().has("sideBar");

  if (!showSideBar) {
    return null;
  }

  return (
    <SideBarContainer>
      <TopBar
        className={(css) =>
          [css, "px-9 flex flex-row flex-nowrap items-center"].join(" ")
        }
      >
        <div className="flex-1"></div>
        <TopAction
          aria-label="close sidebar"
          onClick={() => {
            const url = new URL(document.location.href);
            url.searchParams.delete("sideBar");
            router.replace(url.href);
          }}
        >
          <X />
        </TopAction>
      </TopBar>
      <div className="overflow-hidden">
        <div className="size-full overflow-auto grid grid-cols-1 grid-rows-[min-content_1fr_min-content]">
          <div className="h-9 sticky top-0 from-transparent to-gray-900 bg-linear-to-t"></div>
          <div>{children}</div>
          <div className="h-9 sticky bottom-0 from-transparent to-gray-900 bg-linear-to-b"></div>
        </div>
      </div>
    </SideBarContainer>
  );
}
