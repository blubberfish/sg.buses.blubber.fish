"use client";

import { ONE_DAY } from "@/lib/constants";
import React, { Suspense, useEffect } from "react";
import { useDataMall } from "./datamall-provider";
import { STATE, usePageContext } from "./page-context";

async function loadChunk(
  onData: { (data: DataMall.BusServiceInfo[]): Promise<void> },
  offset = 0
) {
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
      return loadChunk(onData, offset + size);
    }
    return;
  }
  return;
}

function BusServicesLoader() {
  const client = useDataMall();
  const { set } = usePageContext();

  useEffect(() => {
    let abort = false;
    client
      .queryCatalog<{ catalog: string; lastModified: number }>(
        client.STORE_META,
        {
          only: client.STORE_SERVICE,
        }
      )
      .then((meta) => {
        if (meta && Date.now() - meta.lastModified < 30 * ONE_DAY) {
          return;
        }
        return loadChunk(async (data) => {
          await Promise.all(
            data.map((datum) => {
              client.mutateCatalog(client.STORE_SERVICE, datum);
            })
          );
        }).then(() => {
          client.mutateCatalog(client.STORE_META, {
            catalog: client.STORE_SERVICE,
            lastModified: Date.now(),
          });
        });
      })
      .finally(() => {
        if (abort) return;
        set("busServices", STATE.READY);
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
