"use client";

import { useDataMall } from "@/lib/client/components/datamall/contexts/client";
import { DataStore, LocationsDataStoreIndex } from "@/lib/client/datamall";
import { useEffect, useState } from "react";
import { Filter, Items, Trigger } from "./components";
import { Section } from "../section";
import { useBoundingBox } from "./hooks";
import { Deck } from "../deck";
import { useFavorites } from "../favorites/provider";

const CHUNK_SIZE = 10;
const MIN_CHUNK_SIZE = 5;

export function Browser() {
  const client = useDataMall();
  const bounds = useBoundingBox();
  const [startToken, setStartTokenState] = useState<IDBValidKey>();
  const [entities, setEntitiesState] = useState<DataMall.BusStopInfo[]>([]);
  const { data, toggle } = useFavorites();

  const [loading, setLoadingState] = useState<
    ReturnType<(typeof client)["queryCatalog"]> | undefined
  >();

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

  useEffect(() => {
    if (!bounds) {
      setEntitiesState(() => []);
      setLoadingState(() => {
        return client.queryCatalog<DataMall.BusStopInfo>(DataStore.Locations, {
          limit: CHUNK_SIZE,
        });
      });
      return;
    }
    setStartTokenState(() => undefined);
    setLoadingState(
      Promise.resolve(bounds).then(async () => {
        let data = [] as DataMall.BusStopInfo[];
        for (const bound of bounds) {
          const result = await client.queryCatalog<DataMall.BusStopInfo>(
            DataStore.Locations,
            {
              range: IDBKeyRange.bound(bound.min, bound.max),
              index: LocationsDataStoreIndex.ByLngLat,
            }
          );
          data = result.data.filter(({ Latitude, Longitude }) => {
            return (
              Latitude <= bound.max[1] &&
              Latitude >= bound.min[1] &&
              Longitude <= bound.max[0] &&
              Longitude >= bound.min[0]
            );
          });
          if (data.length >= MIN_CHUNK_SIZE) {
            break;
          }
        }
        return {
          data,
        };
      })
    );
  }, [client, bounds]);

  return (
    <Section title="Bus stops">
      <Filter />
      <Items
        active={(key) => data?.has(key) ?? false}
        data={entities}
        onToggleFavorite={(id) => {
          toggle(id);
        }}
      >
        {!!loading && (
          <>
            <Deck.Item />
            <Deck.Item />
            <Deck.Item />
            <Deck.Item />
            <Deck.Item />
          </>
        )}
        {!loading && !bounds && !!startToken && (
          <Trigger
            onTrigger={() => {
              setLoadingState(() => {
                return client.queryCatalog<DataMall.BusStopInfo>(
                  DataStore.Locations,
                  {
                    limit: CHUNK_SIZE,
                    startFrom: startToken,
                  }
                );
              });
            }}
          />
        )}
      </Items>
    </Section>
  );
}
