"use client";

import { type PlaceInfo } from "@/lib/server/actions/search-places";
import { X } from "@deemlol/next-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

function tryParseBase64JSON(data?: string | null) {
  if (!data) return null;
  try {
    return JSON.parse(atob(data)) as PlaceInfo;
  } catch {
    return null;
  }
}

const PARSER = {
  address: tryParseBase64JSON,
} as {
  [key: string]: { (data?: string | null): unknown };
};

const RENDERER = {
  address: (
    { Place: { Label, Neighborhood, SubRegion } }: PlaceInfo,
    onReset?: { (): void }
  ) => (
    <div className="my-3">
      <h2 className="text-sm font-light text-gray-400">Nearest to:</h2>
      <p className="text-violet-400">{Label}</p>
      <button
        className="mt-1 flex flex-row flex-nowrap items-center gap-1 px-2 rounded-full bg-white/8 border hover:bg-white/13 border-white/13 hover:border-white-21"
        onClick={onReset}
        type="button"
      >
        <X className="size-4" />
        <span className="text-sm mr-1">Reset</span>
      </button>
    </div>
  ),
} as {
  [key: string]: { (data: unknown, onReset?: { (): void }): React.ReactNode };
};

export function Filter() {
  const router = useRouter();
  const params = useSearchParams();
  const filter = params.get("filterBy") ?? "";
  const filterData = useMemo(
    () => !!filter && PARSER[filter]?.(params.get(filter)),
    [filter, params]
  );

  return (
    RENDERER[filter]?.(filterData as never, () => {
      console.log("reset");
      const url = new URL(document.location.href);
      url.searchParams.delete("filterBy");
      url.searchParams.delete(filter);
      router.push(url.toString());
    }) || null
  );
}
