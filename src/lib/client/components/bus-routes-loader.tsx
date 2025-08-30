"use client";

import { ONE_DAY } from "@/lib/constants";
import React, { Suspense, useEffect } from "react";
import { useDataMall } from "./datamall-provider";
import { STATE, usePageContext } from "./page-context";

async function loadChunk(
  onData: { (data: DataMall.BusRouteWaypoint[]): Promise<void> },
  offset = 0
) {
  const url = new URL("/api/v1/datamall/services/routes", document.location.href);
  url.searchParams.set("$skip", offset.toFixed(0));
  const response = await fetch(url);
  if (response.ok) {
    const { value } = (await response.json()) as {
      value: DataMall.BusRouteWaypoint[];
    };
    const size = value.length;
    if (size) {
      onData(value);
      return loadChunk(onData, offset + size);
    }
    return;
  }
  return;
}

function BusRoutesLoader() {
  const client = useDataMall();
  const { set } = usePageContext();

  useEffect(() => {
    let abort = false;
    client
      .queryCatalog<{ catalog: string; lastModified: number }>(
        client.STORE_META,
        {
          only: client.STORE_ROUTES,
        }
      )
      .then((meta) => {
        if (meta && Date.now() - meta.lastModified < 30 * ONE_DAY) {
          return;
        }
        return loadChunk(async (data) => {
          await Promise.all(
            data.map((datum) => {
              client.mutateCatalog(client.STORE_ROUTES, datum);
            })
          );
        }).then(() => {
          client.mutateCatalog(client.STORE_META, {
            catalog: client.STORE_ROUTES,
            lastModified: Date.now(),
          });
        });
      })
      .finally(() => {
        if (abort) return;
        set("busRoutes", STATE.READY);
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
