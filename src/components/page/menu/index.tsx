"use client";

import { AppContext } from "@/contexts/app";
import { Menu, X } from "lucide-react";
import { PropsWithChildren, useContext } from "react";

export function PageMenu({ children }: PropsWithChildren) {
  const { useAppMenu } = useContext(AppContext);
  const { menu, toggleMenu } = useAppMenu();

  return (
    <>
      <button
        aria-label="main menu"
        className="p-3 -m-3 ml-0 rounded hover:ring-1 hover:ring-blue-300"
        onClick={() => {
          toggleMenu(true);
        }}
        title="Show menu"
      >
        <Menu className="size-4" />
      </button>
      {menu ? (
        <div className="fixed inset-y-0 right-0 max-w-full w-sm bg-gray-600">
          <header className="px-9 h-16 flex flex-row items-center-safe justify-end">
            <button
              className="p-3 -m-3 ml-0 rounded hover:ring-1 hover:ring-blue-300"
              title="Close menu"
              onClick={() => toggleMenu(false)}
            >
              <X className="size-4" />
            </button>
          </header>
          {children}
        </div>
      ) : null}
    </>
  );
}
