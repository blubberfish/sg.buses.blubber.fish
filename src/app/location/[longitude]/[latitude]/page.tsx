import { bbox } from "@turf/bbox";
import { destination } from "@turf/destination";
import { featureCollection } from "@turf/helpers";
import { redirect } from "next/navigation";
import { DataList } from "./_components";

export default async function Page({
  params,
}: {
  params: Promise<{ [key: string]: string | undefined }>;
}) {
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
  return <DataList bounds={[bounds.slice(0, 2), bounds.slice(-2)]} />;
}
