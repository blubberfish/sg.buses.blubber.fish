"use client";

import { DataStore } from "@/lib/client/datamall";
import React, { Suspense, useEffect } from "react";
import { useDataMall } from "./contexts/client";
import { STATE, useDataContext } from "./contexts/data";
import { ChunkLoader, loadStore } from "./utils";

function BusRoutesLoader() {
  const client = useDataMall();
  const { set } = useDataContext();

  useEffect(() => {
    let abort = false;
    const loader: ChunkLoader = async (onData, offset = 0) => {
      const url = new URL(
        "/api/v1/datamall/services/routes",
        document.location.href
      );
      url.searchParams.set("$skip", offset.toFixed(0));
      const response = await fetch(url);
      if (response.ok) {
        const { value } = (await response.json()) as {
          value: DataMall.BusRouteWaypoint[];
        };
        const size = value.length;
        if (size) {
          onData(value);
          return loader(onData, offset + size);
        }
        return;
      }
      return;
    };
    loadStore(DataStore.Routes, loader, client).finally(() => {
      if (abort) return;
      set(DataStore.Routes, STATE.READY);
    });
    return () => {
      abort = true;
    };
  }, [client, set]);

  return null;
}

export default function BusRoutesWrapper() {
  return (
    <Suspense>
      <BusRoutesLoader />
    </Suspense>
  );
}
