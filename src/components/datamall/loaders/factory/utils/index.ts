import { DatamallDB, MetaStore } from "@/contexts/datamall/db";

export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;
export const THIRTY_DAYS = 30 * ONE_DAY;

export async function metaOf(client: DatamallDB, storeName: string) {
  const store = await client.using(MetaStore);
  const meta = await store.metaOf(storeName);

  return {
    meta,
    updateMeta({ lastUpdated }: { lastUpdated: number }) {
      return store.append({ key: storeName, lastUpdated });
    },
  };
}
