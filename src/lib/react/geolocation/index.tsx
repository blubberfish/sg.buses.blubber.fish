"use client";

import { PropsWithChildren, useCallback, useContext, useState } from "react";
import { Context } from "./context";

export function useGeolocation() {
  return useContext(Context);
}

export function Geolocation({ children }: PropsWithChildren) {
  const [enabled, setEnabled] = useState(false);

  const enable = useCallback(() => {
    setEnabled(true);
  }, []);
  const getState = useCallback(() => {
    return enabled;
  }, [enabled]);

  console.log(enabled);

  return (
    <Context.Provider
      value={{
        enable,
        getState,
      }}
    >
      {children}
    </Context.Provider>
  );
}
