"use client";

import { useContext, useTransition } from "react";
import { Toggle } from "./toggle";
import { FormContext } from "../context";

export const latitudeKey = "userLatitude";
export const longitudeKey = "userLongitude";

export function UserLocation({ label }: { label: string }) {
  const { data, set } = useContext(FormContext);
  const dataKey = "user:location";
  const [isPending, startTransition] = useTransition();
  const latitudeData = data[latitudeKey];
  const longitudeData = data[longitudeKey];
  return (
    <>
      <div className="flex flex-row items-center gap-1">
        <Toggle
          disabled={isPending}
          name={dataKey}
          onChecked={() => {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
              startTransition(() => {
                set(latitudeKey, coords.latitude);
                set(longitudeKey, coords.longitude);
              });
            });
          }}
          onUnchecked={() => {
            startTransition(() => {
              set(latitudeKey, null);
              set(longitudeKey, null);
            });
          }}
        />
        <aside className="text-caption text-sm">{label}</aside>
      </div>
      {!!latitudeData && typeof latitudeData === "number" && (
        <input
          readOnly
          type="hidden"
          name={latitudeKey}
          value={latitudeData}
        />
      )}
      {!!longitudeData && typeof longitudeData === "number" && (
        <input
          readOnly
          type="hidden"
          name={longitudeKey}
          value={longitudeData}
        />
      )}
    </>
  );
}
