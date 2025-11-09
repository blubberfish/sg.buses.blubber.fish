"use client";
import { useEffect, useState } from "react";
import { useDatamall } from "../context";
import { DatamallBusServiceService } from "@/lib/service/datamall/client";
import { Notification } from "./notification";

export function BusServiceLoader({ onReady }: { onReady?: { (): void } }) {
  const datamall = useDatamall();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancel = false;
    const service = datamall.find(DatamallBusServiceService);
    service.addEventListener(
      DatamallBusServiceService.EVENT_READY,
      () => {
        if (cancel) return;
        setReady(true);
        onReady?.();
      },
      { once: true }
    );
    service.setup();
    return () => {
      cancel = true;
    };
  }, [datamall, onReady]);

  if (ready) return null;

  return <Notification content="Loading bus services" />;
}
