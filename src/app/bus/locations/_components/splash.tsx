"use client";

import { CheckCircle, Loader } from "@deemlol/next-icons";
import { useDataContext } from "@/lib/client/components/datamall/contexts/data";
import Spinner from "@/lib/components/spinner";
import React from "react";

export default function SplashScreen({ children }: React.PropsWithChildren) {
  const { locations, routes, services } = useDataContext();

  if (!locations || !routes || !services) {
    return (
      <>
        <div className="w-max mx-auto pt-16">
          <Spinner />
        </div>
        <div className="mt-16 grid grid-cols-[repeat(2,max-content)] auto-rows-min justify-center gap-4">
          <Row loading={!locations} label="Bus stop locations" />
          <Row loading={!services} label="Bus service informations" />
          <Row loading={!routes} label="Route information" />
        </div>
      </>
    );
  }

  return children;
}

function Row({ label, loading }: { loading?: boolean; label: string }) {
  return (
    <div className="col-span-full grid grid-cols-subgrid gap-4 items-center">
      {loading ? (
        <Loader className="text-violet-400 animate-pulse" />
      ) : (
        <CheckCircle className="stroke-emerald-500" />
      )}
      <p>{label}</p>
    </div>
  );
}
