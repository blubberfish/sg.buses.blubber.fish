"use client";

import {
  BusDataContext,
  BusStopsStore,
  BusRoutesStore,
  FavoritesStore,
} from "@/components/bus-data";
import { BusStopInfo } from "@/components/bus-data/types";
import { distance } from "@turf/distance";
import { BusFront, Heart } from "lucide-react";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";

export function List({ center }: { center?: number[] | null }) {
  const db = useContext(BusDataContext);
  const [data, setData] = useState<
    { busStop: BusStopInfo; busServices: string[]; distance: number }[]
  >([]);
  const [favState, setFavState] = useState<{
    [id: string]: boolean | undefined;
  }>({});
  const toggleFavorite = useCallback(
    (key: string) => {
      if (!db) return;
      db.using(FavoritesStore).then((favorites) => {
        if (favState[key]) {
          favorites.drop({ category: FavoritesStore.CAT_BUS_STOP, key });
          setFavState((s) => ({ ...s, [key]: false }));
          return;
        }
        favorites.append({ category: FavoritesStore.CAT_BUS_STOP, key });
        setFavState((s) => ({ ...s, [key]: true }));
      });
    },
    [db, favState],
  );

  useEffect(() => {
    if (!db) return;
    if (!center) return;
    Promise.all([db.using(BusStopsStore), db.using(BusRoutesStore)]).then(
      async ([busStops, busRoutes]) => {
        const result = await Promise.all(
          (await busStops.byGeo({ center })).map(async (busStop) => {
            const { BusStopCode } = busStop;
            const routes = await busRoutes.byStop(BusStopCode);
            return {
              busStop,
              busServices: Array.from(
                new Set(routes.map(({ ServiceNo }) => ServiceNo)),
              ),
              distance: distance(
                center,
                [busStop.Longitude, busStop.Latitude],
                {
                  units: "meters",
                },
              ),
            };
          }),
        );
        result.sort((a, b) => a.distance - b.distance);
        setData(result);
      },
    );
  }, [center, db]);

  useEffect(() => {
    if (!db) return;
    if (!data) return;
    db.using(FavoritesStore).then(async (favorites) => {
      const favs = await favorites.byCategory(FavoritesStore.CAT_BUS_STOP);
      setFavState(Object.fromEntries(favs.map(({ key }) => [key, true])));
    });
  }, [db, data]);

  console.log({ favState });

  return (
    <div className="container mx-auto mt-6">
      {data.map(({ busStop, busServices, distance }) => (
        <div key={busStop.BusStopCode} className="px-6 py-4">
          <div className="bg-white rounded-t flex flex-row">
            <h3 className="text-title text-lg rounded-t flex-1 px-3 py-2">
              <Link
                className="hover:underline"
                href={`/bus-stop/${busStop.BusStopCode}`}
              >
                {busStop.Description}
              </Link>
            </h3>
            <button
              className="text-pink-400 p-3"
              type="button"
              onClick={() => {
                toggleFavorite(busStop.BusStopCode);
              }}
            >
              <Heart
                className={`size-5 ${favState[busStop.BusStopCode] ? "fill-current" : "fill-none"}`}
              />
            </button>
          </div>
          <aside className="from-slate-700 to-slate-800 bg-linear-to-b text-white px-3 py-1">
            <span className="text-xs">{distance.toFixed(0)}m away</span>
          </aside>
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
