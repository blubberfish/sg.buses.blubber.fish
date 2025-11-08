import { DATABASE_DESCRIPTOR, StoreConfiguration } from "./config";
export const VERSIONS = {
  1(database: IDBDatabase) {
    const createStore = (info: StoreConfiguration) => {
      const store = database.createObjectStore(info.store, {
        keyPath: info.key,
      });
      if (!info.indexes) return;
      Object.values(info.indexes).forEach(({ index, key }) => {
        store.createIndex(index, key, { unique: false });
      });
    };
    createStore(DATABASE_DESCRIPTOR.BUS_ROUTES);
    createStore(DATABASE_DESCRIPTOR.BUS_STOPS);
    createStore(DATABASE_DESCRIPTOR.BUS_SERVICES);
  },
} as Readonly<{ [version: number]: { (database: IDBDatabase): void } }>;
