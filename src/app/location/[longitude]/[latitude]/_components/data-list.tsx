"use client";

import { DatamallBusStopService } from "@/lib/service/datamall//client";
import { useDatamall } from "@/lib/react/datamall";
import { BusStopInfo } from "@/lib/service/datamall/types";
import { Bus } from "lucide-react";
import { useEffect, useState } from "react";

export function DataList({ bounds }: { bounds: number[][] }) {
  const { getService } = useDatamall();
  const [data, setData] = useState<Promise<BusStopInfo[]>>();

  useEffect(() => {
    setData((pending) => {
      if (pending) return pending;
      return getService()
        .find(DatamallBusStopService)
        .only({ boundingBox: bounds });
    });
  }, [bounds, getService]);

  if (!data) return null;
  return <RenderList promisedData={data} />;
}

function RenderList({
  promisedData,
}: {
  promisedData: Promise<BusStopInfo[]>;
}) {
  const [data, setData] = useState<BusStopInfo[]>();
  useEffect(() => {
    const pending = promisedData;
    let cancel = false;
    pending.then((result) => {
      if (cancel) return;
      setData(result);
    });
    return () => {
      cancel = true;
    };
  }, [promisedData]);

  if (!data) return null;
  return (
    <div className="grid grid-cols-1 auto-rows-min sm:px-6 md:p-9 sm:gap-y-3 md:gap-y-6 lg:gap-y-9">
      {data.map(({ BusStopCode, Description, RoadName }) => (
        <div className="p-9 bg-gray-900 rounded" key={BusStopCode}>
          <header className="flex flex-row flex-nowrap items-center">
            <p className="flex-1 text-lg text-blue-300">{Description}</p>
            <p className="text-xs ml-3">{BusStopCode}</p>
          </header>
          <p className="mt-3 text-sm text-gray-300">{RoadName}</p>
        </div>
      ))}
    </div>
  );
}
