"use client";

import { useDataMall } from "@/lib/client/components/datamall/contexts/client";
import { DataStore } from "@/lib/client/datamall";
import { useEffect, useRef, useState } from "react";
import { Section } from "../section";
import { Star } from "@deemlol/next-icons";
import { Deck } from "../deck";

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
      <Deck>
        {entities.map(({ BusStopCode, Description, RoadName }) => {
          return (
            <Deck.Item key={BusStopCode}>
              <header className="col-span-full grid grid-cols-subgrid items-center">
                <h2>{Description}</h2>
                <button
                  className="flex flex-row flex-nowrap items-center px-2 py-1 bg-white/8 border border-white/13 rounded"
                  type="button"
                >
                  <Star className="size-3" />
                  <span className="ml-2 text-sm">Star</span>
                </button>
              </header>
              <p className="text-xs text-gray-400">{RoadName}</p>
            </Deck.Item>
          );
        })}
        {!!loading && (
          <>
            <Deck.Item />
            <Deck.Item />
            <Deck.Item />
            <Deck.Item />
            <Deck.Item />
          </>
        )}
        {!loading && startToken && (
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
      </Deck>
    </Section>
  );
}

function Trigger({ onTrigger }: { onTrigger?: { (): void } }) {
  const observerRef = useRef<IntersectionObserver>(undefined);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = elementRef.current;
    if (!target) return;
    const observer = (observerRef.current =
      observerRef.current ??
      new IntersectionObserver(
        (entries) => {
          const scrolledIntoView = entries.some(
            (entry) => entry.target === target && entry.isIntersecting
          );
          if (!scrolledIntoView) return;
          onTrigger?.();
        },
        {
          threshold: 1,
        }
      ));
    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [onTrigger]);

  return <div ref={elementRef}></div>;
}
