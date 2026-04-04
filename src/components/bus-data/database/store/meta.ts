import { DataStore } from "./core";

export interface IStoreMeta {
  key: string;
  lastUpdated: number;
}

export class MetaStore extends DataStore {
  static readonly N = "@meta";

  override get upgrader() {
    return [
      (...params) => {
        const [{ database }] = params;
        database.createObjectStore(MetaStore.N, {
          keyPath: "key",
        });
      },
    ] satisfies DataStore["upgrader"];
  }

  async append(data: IStoreMeta) {
    const database = this.database;
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(MetaStore.N, "readwrite");
      transaction.objectStore(MetaStore.N).put(data);
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  async metaOf(key: string): Promise<IStoreMeta | null> {
    const database = this.database;
    return new Promise<IStoreMeta | null>((resolve, reject) => {
      const transaction = database.transaction(MetaStore.N, "readonly");
      const request = transaction.objectStore(MetaStore.N).get(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
