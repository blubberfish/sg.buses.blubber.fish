"use client";

import {
  useCallback,
  useEffect,
  useState,
  useTransition,
  type PropsWithChildren,
} from "react";
import { BusDataContext, BusDataReadinessContext } from "./context";
import {
  BusRoutesStore,
  BusServicesStore,
  BusStopsStore,
  DatamallDB,
  FavoritesStore,
  MetaStore,
} from "./database";

export function BusDataProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<DatamallDB | null>(null);
  const [readiness, setReadiness] = useState({
    routes: false,
    services: false,
    stops: false,
  });
  const routesReady = useCallback(() => {
    setReadiness((current) => ({ ...current, routes: true }));
  }, []);
  const servicesReady = useCallback(() => {
    setReadiness((current) => ({ ...current, services: true }));
  }, []);
  const stopsReady = useCallback(() => {
    setReadiness((current) => ({ ...current, stops: true }));
  }, []);

  useEffect(() => {
    setState(
      new DatamallDB().setup((builder) => {
        builder
          .use(BusRoutesStore)
          .use(BusServicesStore)
          .use(BusStopsStore)
          .use(FavoritesStore)
          .use(MetaStore);
      }),
    );
  }, []);

  return (
    <BusDataContext.Provider value={state}>
      <BusDataReadinessContext.Provider
        value={{
          ...readiness,
          routesReady,
          servicesReady,
          stopsReady,
        }}
      >
        {children}
      </BusDataReadinessContext.Provider>
    </BusDataContext.Provider>
  );
}
