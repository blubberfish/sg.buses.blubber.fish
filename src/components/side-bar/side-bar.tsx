"use client";

import { LoadBusData } from "@/components/bus-data/loading";
import { Book, Heart, Search, X } from "lucide-react";
import {
  type AnchorHTMLAttributes,
  cloneElement,
  type JSX,
  useState,
} from "react";
import { User } from "./user";
import Link, { type LinkProps } from "next/link";

function PageLink(props: AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps) {
  return (
    <Link
      className="flex flex-row items-center-safe gap-3 px-6 py-3 hover:bg-white/13 not-first:-mt-3"
      {...props}
    />
  );
}

export function SideBar({ children }: { children: JSX.Element }) {
  const [visible, setVisible] = useState(false);
  const clone = cloneElement(children, {
    onClick: () => {
      setVisible(true);
    },
  });
  return (
    <>
      {clone}
      {visible && (
        <div className="bg-surface-b text-white fixed inset-0 z-50 overflow-auto w-full md:w-sm transition-[width]">
          <div className="min-h-dvh grid grid-cols-1 grid-rows-[min-content_1fr_min-content]">
            <header className="flex flex-row items-center-safe">
              <div className="flex-1"></div>
              <button
                className="p-3"
                type="button"
                onClick={() => {
                  setVisible(false);
                }}
              >
                <X className="size-4" />
              </button>
            </header>
            <div className="flex flex-col">
              <PageLink href="/favorites">
                <Heart className="size-5" />
                <span>Favorites</span>
              </PageLink>
              <PageLink href="/search">
                <Search className="size-5" />
                <span>Search</span>
              </PageLink>
              <PageLink href="/browse">
                <Book className="size-5" />
                <span>Browse</span>
              </PageLink>
            </div>
            <footer className="bg-black/21 px-6 py-4 flex flex-col gap-4">
              <User />
              <LoadBusData />
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
