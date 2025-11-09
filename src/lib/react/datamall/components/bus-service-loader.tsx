"use client";
import { useEffect } from "react";
import { useDatamall } from "../context";
import { DatamallBusServiceService } from "@/lib/service/datamall/client";

export function BusServiceLoader() {
  const { getDataState, getService, updateDataState } = useDatamall();

  const { services } = getDataState();

  useEffect(() => {
    if (services === "ready") return;
    let cancel = false;
    const service = getService().find(DatamallBusServiceService);
    const onReady = () => {
      if (cancel) return;
      updateDataState("services", "ready");
    };
    service.addEventListener(DatamallBusServiceService.EVENT_READY, onReady, {
      once: true,
    });
    const onRefresh = () => {
      if (cancel) return;
      updateDataState("services", "refreshing");
    };
    service.addEventListener(
      DatamallBusServiceService.EVENT_REFRESH,
      onRefresh,
      { once: true }
    );
    service.setup();
    return () => {
      cancel = true;
      service.removeEventListener(
        DatamallBusServiceService.EVENT_READY,
        onReady
      );
      service.removeEventListener(
        DatamallBusServiceService.EVENT_REFRESH,
        onRefresh
      );
    };
  }, [getService, services, updateDataState]);

  return null;
}
