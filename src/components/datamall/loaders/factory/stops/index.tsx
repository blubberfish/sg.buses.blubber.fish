import type { BusStopInfo, Values } from "@/contexts/datamall/api/types";
import { DatamallDB, BusStopsStore } from "@/contexts/datamall/db";
import { metaOf, THIRTY_DAYS } from "../utils";

export async function loadStops({
  client,
  offset = 0,
}: {
  client: DatamallDB;
  offset?: number;
}): Promise<void> {
  const { meta, updateMeta } = await metaOf(client, BusStopsStore.N);
  if (meta?.lastUpdated && Date.now() - meta.lastUpdated < THIRTY_DAYS) {
    return;
  }

  const url = new URL("/api/v1/datamall/bus-stop", window.location.origin);
  url.searchParams.set("$skip", offset.toString(10));
  const response = await fetch(url, { method: "GET" });
  const { value } = (await response.json()) as Values<BusStopInfo>;

  const dataStore = await client.using(BusStopsStore);
  await dataStore.append(value);

  if (value.length > 0) {
    return loadStops({ client, offset: offset + value.length });
  }

  await updateMeta({ lastUpdated: Date.now() });
}
