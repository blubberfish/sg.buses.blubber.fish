"use client";
import { useEffect, useState } from "react";
import { useDatamall } from "./context";
import { DatamallBusServiceService } from "../bus-services";

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

  return (
    <div className="px-3 py-1 flex flex-row flex-nowrap items-center gap-x-3 bg-gray-600 text-neutral-100 rounded">
      <div className="size-3 border-2 border-purple-400 border-t-violet-300 rounded-full animate-spin" />
      <p>Loading bus services...</p>
    </div>
  );
}
