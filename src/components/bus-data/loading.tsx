"use client";

import { Circle, X } from "lucide-react";
import {
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
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

function StatusContainer({ children }: PropsWithChildren) {
  return (
    <div className="col-span-full grid grid-cols-subgrid items-center px-3">
      {children}
    </div>
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
    <StatusContainer>
      <StatusIcon completed={!isPending} />
      <h1>Bus routes</h1>
      <aside className="text-white/67 hidden md:block">
        {dataLoaded} data loaded
      </aside>
    </StatusContainer>
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
    <StatusContainer>
      <StatusIcon completed={!isPending} />
      <h1>Bus services</h1>
      <aside className="text-white/67 hidden md:block">
        {dataLoaded} data loaded
      </aside>
    </StatusContainer>
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
    <StatusContainer>
      <StatusIcon completed={!isPending} />
      <h1>Bus stops</h1>
      <aside className="text-white/67 hidden md:block">
        {dataLoaded} data loaded
      </aside>
    </StatusContainer>
  );
}

export function LoadBusData({ children }: PropsWithChildren) {
  const { routes, services, stops } = useContext(BusDataReadinessContext);

  const ready = routes && services && stops;

  if (!ready) {
    return (
      <div className="bg-surface-b/67 text-white backdrop-blur fixed inset-0 z-50 grid grid-cols-[repeat(3,max-content)] auto-rows-min content-center-safe justify-center-safe gap-2">
        <div className="col-span-full"></div>
        {<LoadStops />}
        {<LoadServices />}
        {<LoadRoutes />}
      </div>
    );
  }

  return children;
}
