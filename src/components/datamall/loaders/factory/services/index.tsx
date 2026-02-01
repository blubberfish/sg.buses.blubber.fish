import type { BusServiceInfo, Values } from "@/contexts/datamall/api/types";
import { BusServicesStore, DatamallDB } from "@/contexts/datamall/db";
import { metaOf, THIRTY_DAYS } from "../utils";

export async function loadServices({
  client,
  offset = 0,
}: {
  client: DatamallDB;
  offset?: number;
}): Promise<void> {
  const { meta, updateMeta } = await metaOf(client, BusServicesStore.N);
  if (meta?.lastUpdated && Date.now() - meta.lastUpdated < THIRTY_DAYS) {
    return;
  }
  const url = new URL("/api/v1/datamall/bus-service", window.location.origin);
  url.searchParams.set("$skip", offset.toString(10));
  const response = await fetch(url, { method: "GET" });
  const { value } = (await response.json()) as Values<BusServiceInfo>;
  const dataStore = await client.using(BusServicesStore);
  await dataStore.append(value);
  if (value.length > 0) {
    return loadServices({ client, offset: offset + value.length });
  }
  await updateMeta({ lastUpdated: Date.now() });
}
