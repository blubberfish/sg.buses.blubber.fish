"use client";

import { DatamallContext } from "@/contexts/datamall";
import type { BusStopInfo } from "@/contexts/datamall/api/types";
import { BusStopsStore } from "@/contexts/datamall/db";
import { useContext, useEffect, useState } from "react";

export function Destination({
  id,
  detailed,
}: {
  id: string;
  detailed?: boolean;
}) {
  const { db } = useContext(DatamallContext);
  const [data, setData] = useState<BusStopInfo | Error>();
  useEffect(() => {
    let cancel = false;
    const client = db();
    client.using(BusStopsStore).then(async (store) => {
      const info = await store.byPK(id);
      if (cancel) return;
      setData(info || new Error("Not found"));
    });
    return () => {
      cancel = true;
    };
  }, [db, id]);

  if (!data) {
    return null; // loading
  }

  if (data instanceof Error) {
    return null; // error
  }

  const { Description, RoadName } = data;
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm">{Description}</p>
      {detailed && <p className="text-xl text-gray-400">{RoadName}</p>}
    </div>
  );
}
