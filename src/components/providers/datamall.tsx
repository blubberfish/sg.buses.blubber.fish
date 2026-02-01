"use client";
import { DatamallContext, IDatamallContext } from "@/contexts/datamall";
import {
  DatamallDB,
  BusRoutesStore,
  BusServicesStore,
  BusStopsStore,
  FavoritesStore,
} from "@/contexts/datamall/db";
import { MetaStore } from "@/contexts/datamall/db/store/meta";
import {
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { DatamallLoader } from "../../components/datamall/loaders";
import {
  loadRoutes,
  loadServices,
  loadStops,
} from "../../components/datamall/loaders/factory";

export function DatamallProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<IDatamallContext["db"]>();
  useEffect(() => {
    const db = new DatamallDB().setup((builder) => {
      builder
        .use(BusRoutesStore)
        .use(BusServicesStore)
        .use(BusStopsStore)
        .use(FavoritesStore)
        .use(MetaStore);
    });
    setDb(() => () => db);
  }, []);

  const [ready, setReady] = useState(0);
  const getReadyReport = useCallback(
    (context: Parameters<IDatamallContext["getReport"]>[1]) => {
      const mask = {
        "data:bus-route": 0x1,
        "data:bus-service": 0x2,
        "data:bus-stop": 0x4,
      }[context];
      if (!mask) return false;
      return Boolean(ready & mask);
    },
    [ready]
  );
  const getReport = useCallback(
    (...params: unknown[]) => {
      const [type, context] = params as Parameters<
        IDatamallContext["getReport"]
      >;
      const handler = {
        ready: getReadyReport,
      }[type];
      if (!handler) throw new Error();
      return handler(context);
    },
    [getReadyReport]
  );

  if (!db) {
    return null;
  }

  return (
    <DatamallContext.Provider value={{ db, getReport }}>
      <DatamallLoader
        loading={loadRoutes}
        onReady={() => {
          setReady((current) => current | 0x1);
        }}
      />
      <DatamallLoader
        loading={loadServices}
        onReady={() => {
          setReady((current) => current | 0x2);
        }}
      />
      <DatamallLoader
        loading={loadStops}
        onReady={() => {
          setReady((current) => current | 0x4);
        }}
      />
      {!!(ready & 0x7) ? children : "LOADING"}
    </DatamallContext.Provider>
  );
}
