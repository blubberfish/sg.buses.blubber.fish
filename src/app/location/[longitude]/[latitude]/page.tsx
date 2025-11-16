import { bbox } from "@turf/bbox";
import { destination } from "@turf/destination";
import { featureCollection } from "@turf/helpers";
import { redirect } from "next/navigation";
import { DataList } from "./_components";

function tryParseState(value?: string | string[]) {
  if (!value) return null;
  try {
    const state = JSON.parse(
      atob(typeof value === "string" ? value : value[0])
    );
    if (state && state.type === "search" && typeof state.label === "string") {
      return state as { type: "search"; label: string };
    }
    if (state && typeof state.type === "string") {
      return {
        type: "user",
        label: "Your location",
      };
    }
    return null;
  } catch {
    return null;
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ [key: string]: string | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { state } = await searchParams;
  const headerState = tryParseState(state);

  const { longitude, latitude } = await params;
  const coords = [Number(longitude), Number(latitude)];
  if (coords.some((xy) => isNaN(xy))) {
    redirect("/location");
  }
  const radius = 500;
  const bounds = bbox(
    featureCollection([
      destination(coords, radius, 0, { units: "meters" }),
      destination(coords, radius, 180, { units: "meters" }),
      destination(coords, radius, 90, { units: "meters" }),
      destination(coords, radius, -90, { units: "meters" }),
    ])
  );
  return (
    <>
      <header className="p-9">
        <h1 className="text-neutral-400">Showing bus stops around</h1>
        <h2 className="font-bold">{headerState?.label || [longitude, latitude].join(", ")}</h2>
      </header>
      <DataList bounds={[bounds.slice(0, 2), bounds.slice(-2)]} />
    </>
  );
}
