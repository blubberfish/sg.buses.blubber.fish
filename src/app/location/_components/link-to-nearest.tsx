"use client";

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, useEffect, useState } from "react";

async function getCurrentLocation() {
  return new Promise<number[]>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        resolve([longitude, latitude]);
      }
    );
  });
}

export function LinkToNearest({
  disabled,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();
  const [pending, setPending] = useState<Promise<number[]>>();

  useEffect(() => {
    if (!pending) return;
    let cancel = false;
    pending
      .then((coords) => {
        if (cancel) return;
        router.push(
          `/location/${coords.map((xy) => encodeURIComponent(xy)).join("/")}`
        );
      })
      .finally(() => {
        if (cancel) return;
        setPending(() => undefined);
      });
    return () => {
      cancel = true;
    };
  }, [pending, router]);

  return (
    <button
      disabled={disabled || !!pending}
      onClick={(event) => {
        setPending((current) => {
          if (current) return current;
          return getCurrentLocation();
        });
        onClick?.(event);
      }}
      {...props}
    />
  );
}
