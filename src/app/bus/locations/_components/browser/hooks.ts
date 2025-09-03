"use client";

import type { PlaceInfo } from "@/lib/server/actions/search-places";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

function tryParseBase64JSON(data?: false | string | null) {
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
  [key: string]: { (data?: false | string | null): unknown };
};

export function useFilterData():
  | ({ by: "address"; filter: PlaceInfo } & {
      actions: { reset: { (): void } };
    })
  | null {
  const router = useRouter();
  const params = useSearchParams();
  const filter = params.get("filterBy");
  const filterData = !!filter && params.get(filter);
  return useMemo(() => {
    if (!filter) return null;
    const reset = () => {
      const url = new URL(document.location.href);
      url.searchParams.delete("filterBy");
      url.searchParams.delete(filter);
      router.push(url.toString());
    };
    return {
      by: filter,
      filter: PARSER[filter]?.(filterData),
      actions: {
        reset,
      },
    } as ReturnType<typeof useFilterData>;
  }, [filter, filterData, router]);
}
