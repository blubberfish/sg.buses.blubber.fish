import { Component } from "@/lib/service/core";
import { VERSIONS } from "./versions";

export class IDBService extends Component {
  static database = "blubberfish@datamall";

  static version = 1;

  get database() {
    return (this.constructor as typeof IDBService).database;
  }

  get version() {
    return (this.constructor as typeof IDBService).version;
  }

  client: Promise<IDBDatabase>;

  constructor() {
    super();
    this.client = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.database, this.version);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
      request.onupgradeneeded = ({ newVersion, oldVersion }) => {
        console.log({ oldVersion, newVersion });
        for (let i = oldVersion + 1; i <= (newVersion || 1); i++) {
          VERSIONS[i](request.result);
        }
      };
    });
  }

  async put<T>(store: string, ...items: T[]) {
    const database = await this.client;
    const transaction = database.transaction(store, "readwrite");
    const collection = transaction.objectStore(store);

    return Promise.all(
      items.map(
        (item) =>
          new Promise<void>((resolve, reject) => {
            const request = collection.put(item);
            request.onsuccess = () => {
              resolve();
            };
            request.onerror = () => {
              reject(request.error);
            };
          })
      )
    ) as Promise<unknown>;
  }

  async queryOne<T>(
    store: string,
    params: { filter: IDBValidKey | IDBKeyRange; index?: string }
  ) {
    const database = await this.client;
    const transaction = database.transaction(store, "readonly");
    return new Promise<T | null>((resolve, reject) => {
      const collection = transaction.objectStore(store);
      const request = params.index
        ? collection.index(params.index).get(params.filter)
        : collection.get(params.filter);
      request.onsuccess = () => {
        resolve(request.result as T);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async queryMany<T>(
    store: string,
    params: {
      index?: string;
      startAt?: number;
      limit?: number;
      filter?: IDBValidKey | IDBKeyRange;
    } = {}
  ): Promise<{ next: boolean; data: T[] }> {
    const database = await this.client;
    const transaction = database.transaction(store, "readonly");
    return new Promise<{ next: boolean; data: T[] }>((resolve) => {
      const collection = transaction.objectStore(store);
      const { filter, index, limit, startAt } = params;
      const result = [] as T[];
      const request = index
        ? collection.index(index).openCursor(filter)
        : collection.openCursor(filter);
      let skipped = Math.max(startAt ?? 0, 0);
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) {
          resolve({ next: false, data: result });
          return;
        }
        if (result.length >= Math.max(limit ?? 1, 1)) {
          resolve({ next: true, data: result });
          return;
        }
        if (skipped > 0) {
          cursor.advance(skipped);
          skipped = 0;
          return;
        }
        result.push(cursor.value);
        cursor.continue();
        return;
      };
    });
  }
}
