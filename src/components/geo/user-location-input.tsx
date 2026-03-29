"use client";

import { useState, useTransition } from "react";

export function UserLocationInput() {
  const [isPending, startTransition] = useTransition();
  const [watchHandle, setWatchHandle] = useState<number | null>(null);
  const [geo, setGeo] = useState<GeolocationCoordinates | null>(null);
  return (
    <>
      <div className="flex flex-row items-center gap-3">
        <button
          className={`bg-sky-800 rounded-full aspect-[2/1] h-4`}
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              setWatchHandle((current) => {
                if (current) {
                  navigator.geolocation.clearWatch(current);
                  setWatchHandle(null);
                  return null;
                }
                return navigator.geolocation.watchPosition(({ coords }) => {
                  startTransition(() => {
                    setGeo(coords);
                  });
                });
              });
            });
          }}
        >
          <div
            className={`bg-slate-300 rounded-full aspect-square h-full ${watchHandle ? "translate-x-full" : "translate-x-0"} transition-transform`}
          />
        </button>
        <aside className="text-xs text-caption">Use my location to improve results</aside>
      </div>
      {!!geo && (
        <>
          <input readOnly type="hidden" name="latitude" value={geo.latitude} />
          <input readOnly type="hidden" name="longitude" value={geo.longitude} />
        </>
      )}
    </>
  );
}
