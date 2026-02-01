"use client";

import { AppContext } from "@/contexts/app";
import { useContext, type PropsWithChildren } from "react";

export function AppProvider({ children }: PropsWithChildren) {
  const { useAppMenu } = useContext(AppContext);
  const menuState = useAppMenu();
  return (
    <AppContext.Provider
      value={{
        useAppMenu() {
          return menuState;
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
