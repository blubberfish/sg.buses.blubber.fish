"use client";

import { useDataMall } from "@/lib/client/components/datamall/contexts/client";
import { DataStore } from "@/lib/client/datamall";
import { Suspense, useEffect, useRef, useState } from "react";
import { Section } from "../section";

const CHUNK_SIZE = 25;

const SKELETON = new Array(CHUNK_SIZE).fill(null).map((_, i) => (
  <div className="col-span-full grid grid-cols-subgrid px-6 py-1 gap-6" key={i}>
    <div className="w-full bg-gray-400 rounded animate-pulse">&nbsp;</div>
    <div className="w-full min-w-[8ch] bg-gray-400 rounded animate-pulse">
      &nbsp;
    </div>
  </div>
));

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

  return <Section title="Browse bus stops">

  </Section>
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
