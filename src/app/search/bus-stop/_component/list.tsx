"use client";

import { DatamallContext } from "@/contexts/datamall";
import type {
  BusServiceInfo,
  BusStopInfo,
} from "@/contexts/datamall/api/types";
import {
  BusRoutesStore,
  BusServicesStore,
  BusStopsStore,
} from "@/contexts/datamall/db";
import { useContext, useEffect, useState } from "react";
import { Skeleton } from "./skeleton";
import { Destination } from "./destination";
import { GeneralDetails, MoreDetails } from "./details";
import { Card, CardHeader, CardList } from "./card";

export interface IListEntry {
  buses: {
    id: string;
    destinationId: string;
    frequencies: {
      peak: {
        am: string;
        pm: string;
      };
      offpeak: {
        am: string;
        pm: string;
      };
    };
  }[];
  info: {
    id: string;
    label: string;
    description: string;
  };
  _: {
    info: BusStopInfo;
    buses: BusServiceInfo[];
  };
}

export function List({ center }: { center: number[] }) {
  const { db, getReport } = useContext(DatamallContext);
  const [pending, setPending] = useState<Promise<unknown>>();
  const [data, setData] = useState<IListEntry[]>();
  useEffect(() => {
    const ready =
      getReport("ready", "data:bus-route") &&
      getReport("ready", "data:bus-service") &&
      getReport("ready", "data:bus-stop");
    if (!ready) return;
    let cancel = false;
    const client = db();
    Promise.all([
      client.using(BusRoutesStore),
      client.using(BusServicesStore),
      client.using(BusStopsStore),
    ])
      .then(async ([routesStore, busServicesStore, busStopsStore]) => {
        const busStops = await Promise.all(
          (
            await busStopsStore.byGeo({ center })
          ).map(async (context) => {
            const intersects = await routesStore.byStop(context.BusStopCode);
            let services = await Promise.all(
              intersects
                .filter(Boolean)
                .map(async ({ ServiceNo, Direction }) =>
                  busServicesStore.byPK(ServiceNo, Direction)
                )
            );
            services = services.filter(Boolean);
            return {
              context,
              services,
            };
          })
        );
        return busStops.map(({ context, services }) => ({
          buses: services.map(
            ({
              ServiceNo,
              DestinationCode,
              AM_Offpeak_Freq,
              AM_Peak_Freq,
              PM_Offpeak_Freq,
              PM_Peak_Freq,
            }) => ({
              id: ServiceNo,
              destinationId: DestinationCode,
              frequencies: {
                peak: {
                  am: AM_Peak_Freq,
                  pm: PM_Peak_Freq,
                },
                offpeak: {
                  am: AM_Offpeak_Freq,
                  pm: PM_Offpeak_Freq,
                },
              },
            })
          ),
          info: {
            id: context.BusStopCode,
            label: context.Description,
            description: context.RoadName,
          },
          _: {
            info: context,
            buses: services,
          },
        })) satisfies IListEntry[];
      })
      .then((result) => {
        if (cancel) return;
        setData(() => result);
      })
      .finally(() => {
        if (cancel) return;
        setPending(() => undefined);
      });
    return () => {
      cancel = true;
    };
  }, [center, db, getReport]);

  if (!data || !!pending) {
    return (
      <>
        <Card skeleton>
          <CardHeader skeleton />
          <GeneralDetails skeleton>
            <MoreDetails skeleton />
          </GeneralDetails>
        </Card>
        <Card skeleton>
          <CardHeader skeleton />
          <GeneralDetails skeleton>
            <MoreDetails skeleton />
          </GeneralDetails>
        </Card>
      </>
    );
  }
  return (
    <>
      {data.map(({ info, buses }) => {
        return (
          <Card key={info.id}>
            <CardHeader
              id={info.id}
              link={`/bus-stop/${info.id}`}
              title={info.label}
              subtitle={info.description}
            />
            <CardList>
              {buses.map((bus) => (
                <GeneralDetails
                  key={bus.id}
                  label={bus.id}
                  description={<Destination id={bus.destinationId} />}
                >
                  <MoreDetails
                    peakAmFreq={bus.frequencies.peak.am}
                    peakPmFreq={bus.frequencies.peak.pm}
                    offpeakAmFreq={bus.frequencies.offpeak.am}
                    offpeakPmFreq={bus.frequencies.offpeak.pm}
                  />
                </GeneralDetails>
              ))}
            </CardList>
          </Card>
        );
      })}
    </>
  );
}
