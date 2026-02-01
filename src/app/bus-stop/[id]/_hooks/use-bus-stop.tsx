import { DatamallContext } from "@/contexts/datamall";
import { BusStopInfo } from "@/contexts/datamall/api/types";
import { BusStopsStore } from "@/contexts/datamall/db";
import { useContext, useEffect, useState } from "react";

export function useBusStop(id: string) {
  const { db } = useContext(DatamallContext);
  const [pending, setPending] = useState<Promise<BusStopInfo>>();
  const [data, setData] = useState<BusStopInfo>();
  useEffect(() => {
    setPending(
      db()
        .using(BusStopsStore)
        .then((store) => store.byPK(id))
    );
  }, [db, id]);
  useEffect(() => {
    if (!pending) return;
    let cancel = false;
    pending
      .then((result) => {
        if (cancel) return;
        setData(result);
      })
      .finally(() => {
        if (cancel) return;
        setPending(() => undefined);
      });
    return () => {
      cancel = true;
    };
  }, [pending]);
  return { data, pending: !!pending };
}
