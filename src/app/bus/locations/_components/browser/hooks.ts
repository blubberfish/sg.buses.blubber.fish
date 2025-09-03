"use client";

import type { PlaceInfo } from "@/lib/server/actions/search-places";
import { BEARING, RADIUS_STEPS } from "@/lib/constants";
import { destination } from "@turf/destination";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

export function useBoundingBox() {
  const filter = useFilterData();
  return useMemo(() => {
    if (!filter) return null;
    if (filter.by === "address") {
      const {
        filter: {
          Place: {
            Geometry: { Point },
          },
        },
      } = filter;
      return RADIUS_STEPS.map((distance) => {
        const poles = Object.values(BEARING).map((bearing) =>
          destination(Point, distance, bearing, { units: "meters" })
        );
        const longitudes = poles.map((p) => p.geometry.coordinates[0]);
        const latitudes = poles.map((p) => p.geometry.coordinates[1]);
        return {
          min: [Math.min(...longitudes), Math.min(...latitudes)],
          max: [Math.max(...longitudes), Math.max(...latitudes)],
        };
      });
    }
    return null;
  }, [filter]);
}

async function locateUser(): Promise<GeolocationCoordinates | null> {
  if (!("geolocation" in navigator)) return null;
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve(coords);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export function useUserLocation() {
  const [position, setPosition] = useState<
    GeolocationCoordinates | undefined | null
  >(null);
  const [loading, setLoading] = useState(
    locateUser().catch((reason) => {
      console.error(new Error("User location error", { cause: reason }));
      return null;
    })
  );
  useEffect(() => {
    if (!loading) return;

    let abort = false;
    loading.then((coords) => {
      if (abort) return;
      setPosition(coords);
    });
    return () => {
      abort = true;
    };
  }, [loading]);

  return {
    loading: !!loading,
    position,
    refresh() {
      if (!!loading) return;
      setLoading(locateUser());
    },
  };
}
