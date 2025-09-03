"use client";

import {
  DataMallProvider,
  useDataMall,
} from "@/lib/client/components/datamall/contexts/client";
import { DataStore, RoutesDataStoreIndex } from "@/lib/client/datamall";
import { Suspense, useEffect, useMemo, useState } from "react";

function useServices(atLocation: string) {
  const client = useDataMall();
  const [data, setData] = useState<DataMall.BusRouteWaypoint[]>();
  const [loading, setLoading] = useState<
    ReturnType<(typeof client)["queryCatalog"]> | null | undefined
  >();

  useEffect(() => {
    setLoading(() =>
      client.queryCatalog<DataMall.BusRouteWaypoint>(DataStore.Routes, {
        range: IDBKeyRange.only([atLocation]),
        index: RoutesDataStoreIndex.ByLocation,
      })
    );
  }, [atLocation, client]);

  useEffect(() => {
    if (!loading) return;
    let abort = false;
    loading
      .then(({ data: result }) => {
        if (abort) return;
        setData(result as DataMall.BusRouteWaypoint[]);
      })
      .finally(() => {
        if (abort) return;
        setLoading(() => undefined);
      });
    return () => {
      abort = true;
    };
  }, [loading]);

  return data;
}

function List({ locationCode }: { locationCode: string }) {
  const services = useServices(locationCode);
  const asList = useMemo(
    () =>
      Array.from(
        new Set(
          services
            ?.map(({ ServiceNo }) => ServiceNo)
            .sort((a, b) => {
              if (a.length < b.length) return -1;
              if (a.length > b.length) return 1;
              return a.localeCompare(b);
            })
        )
      ),
    [services]
  );
  return (
    <ul>
      {asList?.map((serviceNo) => (
        <li key={serviceNo}>{serviceNo}</li>
      ))}
    </ul>
  );
}

export function ServiceList({ locationCode }: { locationCode: string }) {
  return (
    <DataMallProvider>
      <List locationCode={locationCode} />
    </DataMallProvider>
  );
}
