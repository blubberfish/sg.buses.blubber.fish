"use client";

import { DataClient, type DataSourceSetupContext } from "@/lib/client/datamall";
import React, { createContext, Suspense, useContext, useEffect } from "react";

const Context = createContext<DataClient | null | undefined>(null);

export function useDataMall() {
  const client = useContext(Context);
  if (!client)
    throw new Error(
      "Please ensure the component is wrapped with <DataMallProvider>"
    );
  return client;
}

function DataMallProvider({ children }: React.PropsWithChildren) {
  useEffect(() => {
    const handler = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const {
        detail: { database, meta },
      } = event as CustomEvent<DataSourceSetupContext>;
      if (meta.from < 1) {
        const locationStore = database.createObjectStore(
          DataClient.STORE_LOCATIONS,
          {
            keyPath: "BusStopCode",
          }
        );

        locationStore.createIndex(DataClient.INDEX_LOCATIONS_POSITION, [
          "Longitude",
          "Latitude",
        ]);

        database.createObjectStore(DataClient.STORE_META, {
          keyPath: "catalog",
        });
      }

      if (meta.from < 2) {
        const serviceStore = database.createObjectStore(
          DataClient.STORE_SERVICE,
          {
            keyPath: ["ServiceNo"],
          }
        );

        const routeStore = database.createObjectStore(DataClient.STORE_ROUTES, {
          keyPath: ["ServiceNo", "BusStopCode", "Direction", "StopSequence"],
        });
      }
    };
    DataClient.instance.addEventListener(
      DataClient.EVENT_REQUIRES_SETUP,
      handler
    );
    return () => {
      DataClient.instance.removeEventListener(
        DataClient.EVENT_REQUIRES_SETUP,
        handler
      );
    };
  });

  useEffect(() => {
    DataClient.instance.init();
  }, []);

  return (
    <Context.Provider value={DataClient.instance}>{children}</Context.Provider>
  );
}

export default function DataMallProviderWrapper({
  children,
}: React.PropsWithChildren) {
  return (
    <Suspense>
      <DataMallProvider>{children}</DataMallProvider>
    </Suspense>
  );
}
