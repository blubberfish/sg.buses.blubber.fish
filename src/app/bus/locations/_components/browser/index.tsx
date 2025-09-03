"use client";

import { useDataMall } from "@/lib/client/components/datamall/contexts/client";
import { DataStore } from "@/lib/client/datamall";
import { useEffect, useState } from "react";
import { Items, Trigger } from "./components";
import { Section } from "../section";

const CHUNK_SIZE = 10;

export function Browser() {
  const client = useDataMall();
  const [startToken, setStartTokenState] = useState<IDBValidKey>();
  const [entities, setEntitiesState] = useState<DataMall.BusStopInfo[]>([]);

  const [loading, setLoadingState] = useState<
    ReturnType<(typeof client)["queryCatalog"]> | undefined
  >(
    client.queryCatalog<DataMall.BusStopInfo>(DataStore.Locations, {
      limit: CHUNK_SIZE,
      startFrom: startToken,
    })
  );

  useEffect(() => {
    if (!loading) return;

    let abort = false;

    loading
      .then(({ data, nextKey }) => {
        if (abort) return;
        setStartTokenState(() => nextKey);
        setEntitiesState((current) => [
          ...current,
          ...(data as DataMall.BusStopInfo[]),
        ]);
      })
      .finally(() => {
        if (abort) return;
        setLoadingState(() => undefined);
      });

    return () => {
      abort = true;
    };
  }, [loading]);

  return (
    <Section title="Bus stops">
      <Items data={entities}>
        {!!loading && (
          <Trigger
            onTrigger={() => {
              setLoadingState(() =>
                client.queryCatalog<DataMall.BusStopInfo>(DataStore.Locations, {
                  limit: CHUNK_SIZE,
                  startFrom: startToken,
                })
              );
            }}
          />
        )}
      </Items>
    </Section>
  );
}
