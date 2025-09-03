"use client";

import { useDataMall } from "@/lib/client/components/datamall/contexts/client";
import { DataStore } from "@/lib/client/datamall";
import { usePromise } from "@/lib/client/hooks";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export function Info({ locationCode }: { locationCode: string }) {
  const client = useDataMall();
  const { data, loading, setPromise } = usePromise<{
    data: DataMall.BusStopInfo[];
  }>();
  useEffect(() => {
    setPromise(
      client.queryCatalog<DataMall.BusStopInfo>(DataStore.Locations, {
        only: locationCode,
      })
    );
  }, [client, locationCode, setPromise]);

  const details = data?.data?.[0];

  if (loading)
    return (
      <div className="">
        <div className="w-full h-4 my-1 rounded from-emerald-400 to-violet-400 bg-linear-210 animate-pulse">&nbsp;</div>
        <div className="w-full h-3 my-1 rounded from-emerald-400 to-violet-400 bg-linear-210 animate-pulse">&nbsp;</div>
      </div>
    );

  if (!details)
    return (
      <div className="grid grid-cols-[repeat(2,max-content)] auto-rows-min items-center justify-center gap-x-3 gap-y-1 p-3 text-neutral-500">
        <AlertTriangle className="col-start-1 col-span-1 row-start-1 row-span-2 size-12" />
        <h1>Oops, something went wrong</h1>
        <aside className="text-sm">Unable to load location details</aside>
      </div>
    );

  const { Description, RoadName } = details;
  return (
    <div className="">
      <header className="text-gray-300">{Description}</header>
      <aside className="text-gray-400 text-xs">{RoadName}</aside>
    </div>
  );
}
