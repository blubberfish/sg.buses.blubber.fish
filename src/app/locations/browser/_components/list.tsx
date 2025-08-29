"use client";

import { useDataMall } from "@/lib/client/components/datamall-provider";
import { Suspense, useEffect, useRef, useState } from "react";

const CHUNK_SIZE = 25;

const SKELETON = new Array(CHUNK_SIZE).fill(null).map((_, i) => (
  <div className="col-span-full grid grid-cols-subgrid px-6 py-1 gap-6" key={i}>
    <div className="w-full bg-gray-400 rounded animate-pulse">&nbsp;</div>
    <div className="w-full min-w-[8ch] bg-gray-400 rounded animate-pulse">&nbsp;</div>
  </div>
));

function List() {
  const client = useDataMall();
  const [startToken, setStartTokenState] = useState<IDBValidKey>();
  const [entities, setEntitiesState] = useState<DataMall.BusStopInfo[]>([]);

  const [loading, setLoadingState] = useState<
    ReturnType<(typeof client)["queryCatalog"]> | undefined
  >(
    client.queryCatalog<DataMall.BusStopInfo>(client.STORE_LOCATIONS, {
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
    <div className="grid grid-cols-[1fr_max-content] grid-flow-dense">
      {entities.map(({ BusStopCode, Description, RoadName }) => (
        <div
          className="col-span-full grid grid-cols-subgrid grid-rows-1 gap-6 bg-white/20 hover:bg-white/15 odd:bg-white/10 odd:hover:bg-white/5"
          key={BusStopCode}
        >
          <div className="py-1 pl-6 text-base">{Description} </div>
          <div className="py-1 pr-6 text-sm text-mono">{RoadName} </div>
        </div>
      ))}
      {!!loading && SKELETON}
      {!!startToken && !loading && (
        <Trigger
          onTrigger={() => {
            setLoadingState(
              client.queryCatalog<DataMall.BusStopInfo>(
                client.STORE_LOCATIONS,
                {
                  limit: CHUNK_SIZE,
                  startFrom: startToken,
                }
              )
            );
          }}
        />
      )}
    </div>
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

export default function ListWrapper() {
  return (
    <Suspense>
      <List />
    </Suspense>
  );
}
