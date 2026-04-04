"use client";

import {
  BusDataContext,
  BusStopsStore,
  BusRoutesStore,
  FavoritesStore,
} from "@/components/bus-data";
import { BusStopInfo } from "@/components/bus-data/types";
import { BusFront, HeartMinus } from "lucide-react";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";

export function List() {
  const db = useContext(BusDataContext);
  const [data, setData] = useState<
    { busStop: BusStopInfo; busServices: string[] }[]
  >([]);
  const removeFavorite = useCallback(
    (key: string) => {
      if (!db) return;
      db.using(FavoritesStore).then((favorites) => {
        favorites.drop({ category: FavoritesStore.CAT_BUS_STOP, key });
      });
      setData((s) => s.filter(({ busStop }) => busStop.BusStopCode !== key));
    },
    [db],
  );

  useEffect(() => {
    if (!db) return;
    Promise.all([
      db.using(BusStopsStore),
      db.using(BusRoutesStore),
      db.using(FavoritesStore),
    ]).then(async ([busStops, busRoutes, favorites]) => {
      const reference = await favorites.byCategory(FavoritesStore.CAT_BUS_STOP);
      const result = await Promise.all(
        reference.map(async ({ key }) => {
          const [busStop, busRoute] = await Promise.all([
            busStops.byPK(key),
            busRoutes.byStop(key),
          ]);
          return {
            busStop,
            busServices: Array.from(
              new Set(busRoute.map(({ ServiceNo }) => ServiceNo)),
            ),
          };
        }),
      );
      setData(result);
    });
  }, [db]);

  return (
    <div className="container mx-auto mt-6">
      {data.map(({ busStop, busServices }) => (
        <div key={busStop.BusStopCode} className="px-6 py-4">
          <div className="bg-white rounded-t flex flex-row">
            <h3 className="text-title text-lg rounded-t flex-1 px-3 py-2">
              <Link
                className="hover:underline"
                href={`/explore/${busStop.BusStopCode}`}
              >
                {busStop.Description}
              </Link>
            </h3>
            <button
              className="text-pink-400 p-3"
              type="button"
              onClick={() => {
                removeFavorite(busStop.BusStopCode);
              }}
            >
              <HeartMinus
                className="size-5"
              />
            </button>
          </div>
          <aside className="from-sky-100 to-violet-100 bg-linear-to-br text-body rounded-b grid grid-cols-[max-content_1fr] px-3">
            <div className="text-sm col-span-full w-max flex flex-row items-center-safe gap-2 py-2">
              <BusFront className="size-4" />
              <span>Services</span>
            </div>
            {busServices.map((service) => (
              <div
                key={service}
                className="col-span-full grid grid-cols-subgrid items-center-safe gap-2 py-2"
              >
                <p>{service}</p>
              </div>
            ))}
          </aside>
        </div>
      ))}
    </div>
  );
}
