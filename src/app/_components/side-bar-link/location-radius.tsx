"use client";
import { Radius } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function getCurrentUserLocation() {
  return new Promise<number[]>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        resolve([longitude, latitude]);
      }
    );
  });
}

export function LocationRadiusSideBarLink() {
  const [pending, setPending] = useState<Promise<number[]>>();
  const router = useRouter();

  useEffect(() => {
    if (!pending) return;
    let cancel = false;
    pending.then((coords) => {
      if (cancel) return;
      router.push(`/location/${coords.join("/")}`);
    });
    return () => {
      cancel = true;
    };
  }, [pending, router]);

  return (
    <button
      className="px-9 py-3 flex flex-row flex-nowrap items-center hover:text-blue-300"
      disabled={!!pending}
      type="button"
      onClick={() => {
        setPending((current) => {
          if (current) return current;
          return getCurrentUserLocation();
        });
      }}
    >
      <Radius />
      <span className="ml-3">Around me</span>
    </button>
  );
}
