"use client";

import { BusDataContext, BusStopsStore } from "@/components/bus-data";
import { getBusArrival } from "@/components/bus-data/actions";
import type {
  BusStopArrivalInfo,
  BusStopInfo,
} from "@/components/bus-data/types";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const { busStopCode } = useParams();
  const db = useContext(BusDataContext);
  const [data, setData] = useState<
    {
      arrivalDateTime: Date;
      destinationBusStop: BusStopInfo;
      destinationId: string;
      feature: string;
      load: string;
      serviceId: string;
    }[]
  >();

  useEffect(() => {
    if (!db) return;
    if (!busStopCode) return;
    Promise.all([db.using(BusStopsStore)]).then(async ([busStopStore]) => {
      const { Services } = await getBusArrival(busStopCode as string);
      const busStack = Services.flatMap(
        ({ ServiceNo, NextBus, NextBus2, NextBus3 }) =>
          [NextBus, NextBus2, NextBus3]
            .filter((data) => Boolean(data?.EstimatedArrival))
            .map(({ DestinationCode, EstimatedArrival, Feature, Load }) => ({
              serviceId: ServiceNo,
              destinationId: DestinationCode,
              arrivalDateTime: new Date(EstimatedArrival),
              feature: Feature,
              load: Load,
            })),
      );
      const stateData = await Promise.all(
        busStack.map(async (bus) => {
          const destinationBusStop = await busStopStore.byPK(bus.destinationId);
          return {
            ...bus,
            destinationBusStop,
          };
        }),
      );
      const now = Date.now();
      setData(
        stateData
          .filter(({ arrivalDateTime }) => arrivalDateTime.valueOf() > now)
          .sort(
            (a, b) => a.arrivalDateTime.valueOf() - b.arrivalDateTime.valueOf(),
          ),
      );
    });
  }, [busStopCode, db]);

  if (!data) return null;

  const now = Date.now();
  return (
    <>
      {data.map(({ serviceId, destinationBusStop, arrivalDateTime }) => {
        const dt = arrivalDateTime.valueOf() - now;
        const minutes = dt / 1000 / 60;
        return (
          <section
            key={[serviceId, arrivalDateTime.valueOf()].join("-")}
            className="container mx-auto px-6 mt-6"
          >
            <h3 className="text-title text-lg font-bold px-3 mb-2">
              {serviceId}
            </h3>
            <aside className="bg-surface-b text-white text-xs rounded-t px-3 py-2">
              <p>{destinationBusStop.Description}</p>
            </aside>
            <div
              className={`from-sky-100 to-violet-200 bg-linear-to-br ${minutes < 0 ? "text-caption" : "text-body"} px-3 py-2`}
            >
              {minutes > 0
                ? minutes < 1
                  ? "any time now"
                  : `in ${Math.abs(minutes).toFixed(0)} minutes`
                : `${Math.abs(minutes).toFixed(0)} minutes ago`}
              <span className="text-caption text-sm">
                &nbsp;at&nbsp;
                {arrivalDateTime.toLocaleTimeString()}
              </span>
            </div>
          </section>
        );
      })}
    </>
  );
}
