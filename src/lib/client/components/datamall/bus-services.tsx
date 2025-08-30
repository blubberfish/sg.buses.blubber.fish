"use client";

import { DataStore } from "@/lib/client/datamall";
import React, { Suspense, useEffect } from "react";
import { STATE, useDataContext, useDataMall } from "./contexts";
import { ChunkLoader, loadStore } from "./utils";

function BusServicesLoader() {
  const client = useDataMall();
  const { set } = useDataContext();

  useEffect(() => {
    let abort = false;
    const loader: ChunkLoader = async (
      onData,
      offset = 0
    ) => {
      const url = new URL("/api/v1/datamall/services", document.location.href);
      url.searchParams.set("$skip", offset.toFixed(0));
      const response = await fetch(url);
      if (response.ok) {
        const { value } = (await response.json()) as {
          value: DataMall.BusServiceInfo[];
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
    loadStore(DataStore.Services, loader).finally(() => {
      if (abort) return;
      set(DataStore.Services, STATE.READY);
    });
    return () => {
      abort = true;
    };
  }, [client, set]);

  return null;
}

export default function BusServiceWrapper() {
  return (
    <Suspense>
      <BusServicesLoader />
    </Suspense>
  );
}
