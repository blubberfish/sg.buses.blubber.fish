"use client";

import {
  BusDataContext,
  BusRoutesStore,
  BusStopsStore,
} from "@/components/bus-data";
import { BusStopInfo } from "@/components/bus-data/types";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Slot() {
  const { busStopCode } = useParams();
  const db = useContext(BusDataContext);
  const [data, setData] = useState<{
    busStop: BusStopInfo;
    busServices: string[];
  }>();

  useEffect(() => {
    if (!db || !(busStopCode && typeof busStopCode === "string")) return;
    Promise.all([db.using(BusStopsStore), db.using(BusRoutesStore)]).then(
      async ([busStopsStore, busRoutesStore]) => {
        const [busStop, busServices] = await Promise.all([
          busStopsStore.byPK(busStopCode as string),
          busRoutesStore
            .byStop(busStopCode as string)
            .then((s) =>
              Array.from(new Set(s.map(({ ServiceNo }) => ServiceNo))),
            ),
        ]);
        setData({ busStop, busServices });
      },
    );
  }, [db, busStopCode]);

  if (!data) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 mt-6">
      <h2 className="bg-white rounded-t px-3 py-2">{data.busStop.Description}</h2>
      <aside className="bg-surface-b text-white text-xs px-3 py-1">{data.busStop.RoadName}</aside>
      <ul className="from-sky-100 to-violet-100 bg-linear-to-br flex flex-row flex-wrap gap-2 px-3 py-2">
        {data.busServices.map((serviceNo) => (
          <li key={serviceNo} className="bg-surface-b text-white text-sm rounded px-1">{serviceNo}</li>
        ))}
      </ul>
    </section>
  );
}
