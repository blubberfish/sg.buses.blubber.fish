"use client";

import { CheckCircle, Loader } from "@deemlol/next-icons";
import { usePageContext } from "@/lib/client/components/page-context";
import Spinner from "@/lib/components/spinner";
import React from "react";

export default function SplashScreen({ children }: React.PropsWithChildren) {
  const { busRoutes, busServices, busStopLoctions } = usePageContext();

  if (!busRoutes || !busStopLoctions) {
    return (
      <div className="w-full h-[calc(100svh-theme(spacing.16))]">
        <div className="w-max mx-auto mt-16">
          <Spinner />
        </div>
        <div className="mt-16 grid grid-cols-[repeat(2,max-content)] auto-rows-min justify-center gap-4">
          <Row loading={!busStopLoctions} label="Bus stop locations" />
          <Row loading={!busServices} label="Bus service informations" />
          <Row loading={!busRoutes} label="Route information" />
        </div>
      </div>
    );
  }

  return children;
}

function Row({ label, loading }: { loading?: boolean; label: string }) {
  return (
    <div className="col-span-full grid grid-cols-subgrid gap-4 items-center">
      {loading ? <Loader className="text-violet-400 animate-pulse" /> : <CheckCircle className="stroke-emerald-500" />}
      <p>{label}</p>
    </div>
  );
}
