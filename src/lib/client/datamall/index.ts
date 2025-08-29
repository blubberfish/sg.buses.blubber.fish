import { init } from "next/dist/compiled/webpack/webpack";

export interface DataSourceSetupContext {
  meta: { from: number; to: number };
  database: IDBDatabase;
}

export class DataClient extends EventTarget {
  static instance = new DataClient();

  static readonly EVENT_REQUIRES_SETUP = "datasource.setup";

  static readonly EVENT_READY = "datasource.ready";

  static readonly STORE_LOCATIONS = "locations";
  static readonly INDEX_LOCATIONS_POSITION = "by.lnglat";

  static readonly STORE_ROUTES = "routes";

  static readonly STORE_SERVICE = "services";

  static readonly STORE_META = "meta";

  static get VERSION() {
    return 1;
  }
  static get NAMESPACE() {
    return "datamall@blubber.fish";
  }

  get STORE_LOCATIONS() {
    return DataClient.STORE_LOCATIONS;
  }
  get INDEX_LOCATIONS_POSITION() {
    return DataClient.INDEX_LOCATIONS_POSITION;
  }

  get STORE_ROUTES() {
    return DataClient.STORE_ROUTES;
  }

  get STORE_SERVICE() {
    return DataClient.STORE_SERVICE;
  }

  get STORE_META() {
    return DataClient.STORE_META;
  }

  constructor() {
    super();
  }

  init() {
    return this.source;
  }

  #source?: Promise<IDBDatabase>;
  get source(): Promise<IDBDatabase> {
    if (this.#source) return this.#source;
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
        this.dispatchEvent(
          new CustomEvent<DataSourceSetupContext>(
            DataClient.EVENT_REQUIRES_SETUP,
            {
              detail: {
                meta: { from: oldVersion, to: newVersion || 1 },
                database: request.result,
              },
            }
          )
        );
      };
    });
    return this.#source;
  }

  set onready(callback: { (database: IDBDatabase): Promise<void> }) {
    this.source.then(callback);
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
    const database = await this.source;
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
    const database = await this.source;
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
