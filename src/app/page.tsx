"use client";

import {
  BusDataContext,
  BusServicesStore,
  BusStopsStore,
  FavoritesStore,
} from "@/components/bus-data";
import { useContext, useEffect } from "react";

export default function Page() {
  const dataSource = useContext(BusDataContext);
  useEffect(() => {
    if (!dataSource) {
      return;
    }
    Promise.resolve(dataSource).then(async (db) => {
      const servicesStore = await db.using(BusServicesStore);
      const stopsStore = await db.using(BusStopsStore);
      const store = await db.using(FavoritesStore);
      const data = await store.byCategory(FavoritesStore.CAT_BUS_STOP);
    });
  }, [dataSource]);
  return null;
}
