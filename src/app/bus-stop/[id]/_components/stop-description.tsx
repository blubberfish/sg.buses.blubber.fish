"use client";

import { useBusStop } from "../_hooks/use-bus-stop";

export function StopDescription({ id }: { id: string }) {
  const { data, pending } = useBusStop(id);
  const loading = !data || pending;

  if (loading) {
    return (
      <span className="max-w-full w-sm rounded bg-neutral-400 animate-pulse">
        &nbsp;
      </span>
    );
  }

  return <span>{data.RoadName}</span>;
}
