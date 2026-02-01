"use client";

import { useEffect, useState } from "react";

export function GeolocationToggle() {
  const [enabled, setEnabled] = useState(false);
  const [pending, setPending] = useState<Promise<number[]>>();
  const [location, setLocation] = useState<number[] | null>(null);
  useEffect(() => {
    if (!enabled) return;
    setPending(
      new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve([position.coords.longitude, position.coords.latitude]);
        });
      })
    );
  }, [enabled]);
  useEffect(() => {
    if (!pending) return;
    let cancel = false;
    pending.then((coords) => {
      if (cancel) return;
      setLocation(coords);
    });
    return () => {
      cancel = true;
    };
  }, [pending]);
  return (
    <>
      <button
        className="flex flex-row items-center-safe gap-3"
        title="Toggle user location"
        type="button"
        onClick={() => {
          setEnabled((current) => !current);
        }}
      >
        <div
          className={`aspect-[2/1] h-4 rounded-full transition-colors ${
            enabled ? "bg-blue-400" : "bg-gray-800"
          }`}
        >
          <div
            className={`size-4 rounded-full bg-gray-300 transition-transform ${
              enabled ? "translate-x-full" : "translate-x-0"
            }`}
          />
        </div>
        <p className="text-xs text-gray-300 whitespace-nowrap">
          Use my location
        </p>
      </button>
      {enabled && location && (
        <>
          <input type="hidden" name="longitude" value={location[0]} />
          <input type="hidden" name="latitude" value={location[1]} />
        </>
      )}
    </>
  );
}
