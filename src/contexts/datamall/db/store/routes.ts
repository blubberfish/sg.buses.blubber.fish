import { BusRouteInfo } from "../../api/types";
import { DataStore } from "./core";

export class BusRoutesStore extends DataStore {
  static readonly N = "@brot";
  static readonly I_BUS = "@service";
  static readonly I_STOP = "@stop";

  override get upgrader() {
    return [
      (...params) => {
        const [{ database }] = params;
        const store = database.createObjectStore(BusRoutesStore.N, {
          keyPath: ["ServiceNo", "Direction", "StopSequence"],
        });
        store.createIndex(BusRoutesStore.I_BUS, ["ServiceNo"]);
        store.createIndex(BusRoutesStore.I_STOP, ["BusStopCode"]);
      },
    ] satisfies DataStore["upgrader"];
  }

  append(data: BusRouteInfo[]) {
    const database = this.database;
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(BusRoutesStore.N, "readwrite");
      data.forEach((item) => {
        transaction.objectStore(BusRoutesStore.N).put(item);
      });
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  byBus(serviceNo: string) {
    const database = this.database;
    return new Promise<BusRouteInfo[]>((resolve, reject) => {
      const transaction = database.transaction(BusRoutesStore.N, "readonly");
      const request = transaction
        .objectStore(BusRoutesStore.N)
        .index(BusRoutesStore.I_BUS)
        .getAll(serviceNo);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  byStop(id: string) {
    const database = this.database;
    return new Promise<BusRouteInfo[]>((resolve, reject) => {
      const transaction = database.transaction(BusRoutesStore.N, "readonly");
      const request = transaction
        .objectStore(BusRoutesStore.N)
        .index(BusRoutesStore.I_STOP)
        .getAll(IDBKeyRange.only([id]));
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
