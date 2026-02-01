"use client";
import { DatamallBusRoutesService } from "@/lib/service/datamall/client";
import { useEffect } from "react";
import { useDatamall } from "../context";

export function BusRouteLoader() {
  const { getDataState, getService, updateDataState } = useDatamall();

  const { routes } = getDataState();

  useEffect(() => {
    if (routes === "ready") return;
    let cancel = false;
    const service = getService().find(DatamallBusRoutesService);
    const handleStateRefresh = () => {
      if (cancel) return;
      updateDataState("routes", "refreshing");
    };
    service.addEventListener(
      DatamallBusRoutesService.EVENT_STATUS_REFRESHING,
      handleStateRefresh,
      { once: true }
    );
    const handleStateReady = () => {
      if (cancel) return;
      updateDataState("routes", "ready");
    };
    service.addEventListener(
      DatamallBusRoutesService.EVENT_STATUS_READY,
      handleStateReady,
      { once: true }
    );
    service.setup();
    return () => {
      cancel = true;
      service.removeEventListener(
        DatamallBusRoutesService.EVENT_STATUS_REFRESHING,
        handleStateRefresh
      );
      service.removeEventListener(
        DatamallBusRoutesService.EVENT_STATUS_READY,
        handleStateReady
      );
    };
  }, [getService, routes, updateDataState]);

  return null;
}
