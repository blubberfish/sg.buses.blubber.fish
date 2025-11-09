"use client";
import { useEffect } from "react";
import { useDatamall } from "../context";
import { DatamallBusStopService } from "@/lib/service/datamall/client";

export function BusStopLoader({ onReady }: { onReady?: { (): void } }) {
  const { getDataState, getService, updateDataState } = useDatamall();

  const { locations } = getDataState();

  useEffect(() => {
    if (locations === "ready") return;
    let cancel = false;
    const service = getService().find(DatamallBusStopService);
    const onReady = () => {
      if (cancel) return;
      updateDataState("locations", "ready");
    };
    service.addEventListener(DatamallBusStopService.EVENT_READY, onReady, {
      once: true,
    });
    const onRefresh = () => {
      if (cancel) return;
      updateDataState("locations", "refreshing");
    };
    service.addEventListener(DatamallBusStopService.EVENT_REFRESH, onRefresh, {
      once: true,
    });
    service.setup();
    return () => {
      cancel = true;
      service.removeEventListener(DatamallBusStopService.EVENT_READY, onReady);
      service.removeEventListener(
        DatamallBusStopService.EVENT_REFRESH,
        onRefresh
      );
    };
  }, [locations, getService, updateDataState]);

  return null;
}
