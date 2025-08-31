"use client";

import { DataClient, DataStore } from "@/lib/client/datamall";
import { ONE_DAY } from "@/lib/constants";

export interface ChunkLoader {
  (
    onData: { <T extends unknown[] = unknown[]>(data: T): Promise<void> },
    offset?: number
  ): Promise<void>;
}

export interface DataStoreLoader {
  (store: DataStore, loader: ChunkLoader, context: DataClient): Promise<void>;
}

export const loadStore: DataStoreLoader = async (store, loader, context) =>
  context
    .queryCatalog<{ catalog: DataStore; lastModified: number }>(
      DataStore.Meta,
      {
        only: store,
      }
    )
    .then((meta) => meta && Date.now() - meta.lastModified < 7 * ONE_DAY)
    .then((skip) => {
      if (skip) return;
      return loader(async (data) => {
        await Promise.all(
          data.map((datum) => context.mutateCatalog(store, datum))
        );
      }).then(() => {
        context.mutateCatalog(DataStore.Meta, {
          catalog: store,
          lastModified: Date.now(),
        });
      });
    });
