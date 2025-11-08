"use client";
import { useState } from "react";
import { BusRouteLoader } from "./bus-route-loader";
import { BusServiceLoader } from "./bus-service-loader";
import { BusStopLoader } from "./bus-stop-loader";

export function Loaders() {
  const [ready, setReady] = useState<string[]>([]);

  if (new Set(ready).size >= 3) {
    return null;
  }

  return (
    <div className="fixed right-9 bottom-9 grid grid-cols-1 auto-rows-fr gap-y-3">
      <BusRouteLoader
        onReady={() => {
          setReady((current) => [...current, "busroutes"]);
        }}
      />
      <BusServiceLoader
        onReady={() => {
          setReady((current) => [...current, "busservices"]);
        }}
      />
      <BusStopLoader
        onReady={() => {
          setReady((current) => [...current, "busstops"]);
        }}
      />
    </div>
  );
}
