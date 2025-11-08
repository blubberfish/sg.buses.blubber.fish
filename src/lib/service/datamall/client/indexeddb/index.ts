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
}
