"use client";

import { ONE_DAY } from "@/lib/constants";
import { Suspense, useEffect } from "react";
import { useDataMall } from "./datamall-provider";

async function loadChunk(
  onData: { (data: DataMall.BusStopInfo[]): Promise<void> },
  offset = 0
) {
  const url = new URL("/api/v1/datamall/locations", document.location.href);
  url.searchParams.set("$skip", offset.toFixed(0));
  const response = await fetch(url);
  if (response.ok) {
    const { value } = (await response.json()) as {
      value: DataMall.BusStopInfo[];
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

function LocationsLoader() {
  const client = useDataMall();

  useEffect(() => {
    client
      .queryCatalog<{ catalog: string; lastModified: number }>(
        client.STORE_META,
        {
          only: client.STORE_LOCATIONS,
        }
      )
      .then((meta) => {
        if (meta && Date.now() - meta.lastModified < 30 * ONE_DAY) {
          return;
        }
        loadChunk(async (data) => {
          await Promise.all(
            data.map((datum) => {
              client.mutateCatalog(client.STORE_LOCATIONS, datum);
            })
          );
        }).then(() => {
          client.mutateCatalog(client.STORE_META, {
            catalog: client.STORE_LOCATIONS,
            lastModified: Date.now(),
          });
        });
      });
  });

  return null;
}

export default function LocationsLoaderWrapper() {
  return (
    <Suspense>
      <LocationsLoader />
    </Suspense>
  );
}
