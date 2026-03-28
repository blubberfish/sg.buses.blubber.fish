"use client";

import { Circle } from "lucide-react";
import { useContext, useEffect, useState, useTransition } from "react";
import { listBusRoutes, listBusServices, listBusStops } from "./actions";
import { BusDataContext, BusDataReadinessContext } from "./context";
import {
  BusRoutesStore,
  BusServicesStore,
  BusStopsStore,
  MetaStore,
} from "./database";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const FRESH_FOR = SEVEN_DAYS;

function StatusIcon({ completed }: { completed?: boolean }) {
  return (
    <Circle
      className={[
        "size-3",
        completed ? "text-green-500" : "text-amber-500 animate-pulse",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function LoadRoutes() {
  const { routesReady } = useContext(BusDataReadinessContext);
  const [isPending, startTransition] = useTransition();
  const [dataLoaded, setDataLoaded] = useState(0);
  const db = useContext(BusDataContext);

  useEffect(() => {
    if (!db) return;
    startTransition(async () => {
      const metaStore = await db.using(MetaStore);
      const routesStore = await db.using(BusRoutesStore);
      const routesStoreMetadata = await metaStore.metaOf(BusRoutesStore.N);
      let count = 0;
      if (
        !(
          routesStoreMetadata &&
          routesStoreMetadata!.lastUpdated > Date.now() - FRESH_FOR
        )
      ) {
        while (true) {
          const { value } = await listBusRoutes({ offset: count });
          routesStore.append(value);
          if (value.length === 0) {
            break;
          }
          count += value.length;
          setDataLoaded(count);
        }
        await metaStore.append({
          key: BusRoutesStore.N,
          lastUpdated: Date.now(),
        });
      } else {
        count = await routesStore.count();
        setDataLoaded(count);
      }
      routesReady();
    });
  }, [db, routesReady]);

  return (
    <div className="col-span-full grid grid-cols-subgrid items-center">
      <StatusIcon completed={!isPending} />
      <h1>Bus routes</h1>
      <aside className="text-caption hidden md:block">
        {dataLoaded} data found
      </aside>
    </div>
  );
}

function LoadServices() {
  const { servicesReady } = useContext(BusDataReadinessContext);
  const [isPending, startTransition] = useTransition();
  const [dataLoaded, setDataLoaded] = useState(0);
  const db = useContext(BusDataContext);

  useEffect(() => {
    if (!db) return;
    startTransition(async () => {
      const metaStore = await db.using(MetaStore);
      const dataStore = await db.using(BusServicesStore);
      const dataStoreMetadata = await metaStore.metaOf(BusServicesStore.N);
      let count = 0;
      if (
        !(
          dataStoreMetadata &&
          dataStoreMetadata!.lastUpdated > Date.now() - FRESH_FOR
        )
      ) {
        while (true) {
          const { value } = await listBusServices({ offset: count });
          dataStore.append(value);
          if (value.length === 0) {
            break;
          }
          count += value.length;
          setDataLoaded(count);
        }
        await metaStore.append({
          key: BusServicesStore.N,
          lastUpdated: Date.now(),
        });
      } else {
        count = await dataStore.count();
        setDataLoaded(count);
      }
      servicesReady();
    });
  }, [db, servicesReady]);

  return (
    <div className="col-span-full grid grid-cols-subgrid items-center">
      <StatusIcon completed={!isPending} />
      <h1>Bus services</h1>
      <aside className="text-caption hidden md:block">
        {dataLoaded} data found
      </aside>
    </div>
  );
}

function LoadStops() {
  const { stopsReady } = useContext(BusDataReadinessContext);
  const [isPending, startTransition] = useTransition();
  const [dataLoaded, setDataLoaded] = useState(0);
  const db = useContext(BusDataContext);

  useEffect(() => {
    if (!db) return;
    startTransition(async () => {
      const metaStore = await db.using(MetaStore);
      const dataStore = await db.using(BusStopsStore);
      const dataStoreMetadata = await metaStore.metaOf(BusStopsStore.N);
      let count = 0;
      if (
        !(
          dataStoreMetadata &&
          dataStoreMetadata!.lastUpdated > Date.now() - FRESH_FOR
        )
      ) {
        while (true) {
          const { value } = await listBusStops({ offset: count });
          dataStore.append(value);
          if (value.length === 0) {
            break;
          }
          count += value.length;
          setDataLoaded(count);
        }
        await metaStore.append({
          key: BusStopsStore.N,
          lastUpdated: Date.now(),
        });
      } else {
        count = await dataStore.count();
        setDataLoaded(count);
      }
      stopsReady();
    });
  }, [db, stopsReady]);

  return (
    <div className="col-span-full grid grid-cols-subgrid items-center">
      <StatusIcon completed={!isPending} />
      <h1>Bus stops</h1>
      <aside className="text-caption hidden md:block">
        {dataLoaded} data found
      </aside>
    </div>
  );
}

export function LoadBusData() {
  const { routes, services, stops } = useContext(BusDataReadinessContext);

  if (routes && services && stops) {
    return null;
  }

  return (
    <div className="text-xs grid grid-cols-[repeat(2,max-content)_1fr] gap-2 ">
      <h1 className="col-span-full">Loading...</h1>
      {!stops && <LoadStops />}
      {!services && <LoadServices />}
      {!routes && <LoadRoutes />}
    </div>
  );
}
