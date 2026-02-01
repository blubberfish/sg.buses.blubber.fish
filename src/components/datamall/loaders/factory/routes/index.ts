import type { BusRouteInfo, Values } from "@/contexts/datamall/api/types";
import { BusRoutesStore, DatamallDB } from "@/contexts/datamall/db";
import { metaOf, THIRTY_DAYS } from "../utils";

export async function loadRoutes({
  client,
  offset = 0,
}: {
  client: DatamallDB;
  offset?: number;
}): Promise<void> {
  const { meta, updateMeta } = await metaOf(client, BusRoutesStore.N);
  if (meta?.lastUpdated && Date.now() - meta.lastUpdated < THIRTY_DAYS) {
    return;
  }
  const url = new URL("/api/v1/datamall/bus/route", window.location.origin);
  url.searchParams.set("$skip", offset.toString(10));
  const response = await fetch(url, { method: "GET" });
  const { value } = (await response.json()) as Values<BusRouteInfo>;
  const dataStore = await client.using(BusRoutesStore);
  await dataStore.append(value);
  if (value.length > 0) {
    return loadRoutes({ client, offset: offset + value.length });
  }
  await updateMeta({ lastUpdated: Date.now() });
}
