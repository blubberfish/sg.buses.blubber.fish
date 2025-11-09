"use client";
import DatamallService from "@/lib/service/datamall/client";
import { PropsWithChildren, useCallback, useState } from "react";
import { DatamallContext, DatamallState, DataState } from "./context";
import { BusRouteLoader } from "./components/bus-route-loader";

export function BusInfoLoaders({ children }: PropsWithChildren) {
  const [state, setState] = useState<DatamallState>({
    locations: "loading",
    routes: "loading",
    services: "loading",
  });

  const getDataState = useCallback(() => state, [state]);

  const updateDataState = useCallback(
    (key: keyof DatamallState, value: DataState) => {
      setState((current) => {
        if (value === current[key]) return current;
        return {
          ...current,
          [key]: value,
        };
      });
    },
    [setState]
  );

  const getService = useCallback(() => DatamallService.instance, []);

  return (
    <DatamallContext.Provider
      value={{
        getDataState,
        updateDataState,
        getService,
      }}
    >
      {children}
      <div className="fixed bottom-0 right-0">
        {state.routes !== "ready" && <BusRouteLoader />}
      </div>
    </DatamallContext.Provider>
  );
}
