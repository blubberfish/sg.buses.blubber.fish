"use client";

import type { DataSourceSetupContext } from "./types";
import { UPGRADE_LOG } from "./upgrades";

export {
  DataStore,
  LocationsDataStoreIndex,
  RoutesataStoreIndex,
  ServicesDataStoreIndex,
} from "./types";

export class DataClient extends EventTarget {
  static instance = new DataClient();

  static readonly EVENT_REQUIRES_SETUP = "datasource.setup";

  static readonly EVENT_READY = "datasource.ready";

  static get VERSION() {
    return 2;
  }
  static get NAMESPACE() {
    return "datamall@blubber.fish";
  }

  #source: Promise<IDBDatabase>;

  constructor() {
    super();
    this.#source = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DataClient.NAMESPACE, DataClient.VERSION);
      request.onsuccess = () => {
        this.dispatchEvent(new CustomEvent(DataClient.EVENT_READY));
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
      request.onupgradeneeded = ({ newVersion, oldVersion }) => {
        const context: DataSourceSetupContext = {
          meta: { from: oldVersion, to: newVersion || 1 },
          database: request.result,
        };
        UPGRADE_LOG.forEach(({ rule, worker }) => {
          if (rule(context)) {
            worker(context);
          }
        });
        this.dispatchEvent(
          new CustomEvent<DataSourceSetupContext>(
            DataClient.EVENT_REQUIRES_SETUP,
            {
              detail: context,
            }
          )
        );
      };
    });
  }

  set onready(callback: { (database: IDBDatabase): Promise<void> }) {
    this.#source.then(callback);
  }

  queryCatalog<T>(name: string, query: { only: IDBValidKey }): Promise<T>;
  queryCatalog<T>(
    name: string,
    query: {
      startFrom?: IDBValidKey;
      limit?: number;
    }
  ): Promise<{ nextKey?: IDBValidKey; data: T[] }>;
  async queryCatalog(
    name: string,
    query:
      | {
          only: IDBValidKey;
        }
      | {
          startFrom?: IDBValidKey;
          limit?: number;
        }
  ) {
    const database = await this.#source;
    return new Promise<unknown>((resolve, reject) => {
      const transaction = database.transaction([name], "readonly");
      if (query && "only" in query) {
        const request = transaction.objectStore(name).get(query.only);
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => {
          reject(request.error);
        };
        return;
      }
      const data: unknown[] = [];
      const request = transaction
        .objectStore(name)
        .openCursor(
          query?.startFrom ? IDBKeyRange.lowerBound(query.startFrom) : undefined
        );
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (!cursor || (query.limit && data.length >= query.limit)) {
          resolve({
            nextKey: cursor?.key,
            data,
          } satisfies {
            nextKey?: IDBValidKey;
            data: unknown[];
          });
          return;
        }
        data.push(cursor.value);
        cursor.continue();
        return;
      };

      return;
    });
  }

  async mutateCatalog<T = unknown>(name: string, data: T) {
    const database = await this.#source;
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction([name], "readwrite");
      const request = transaction.objectStore(name).put(data);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
