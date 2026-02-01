import { BusServiceInfo } from "../../api/types";
import { DataStore } from "./core";

export class BusServicesStore extends DataStore {
  static readonly N = "@bsvc";
  static readonly I_CODE = "@code";
  static readonly I_DESTINATION = "@destination";
  static readonly I_ORIGIN = "@origin";

  override get upgrader() {
    return [
      (...params) => {
        const [{ database }] = params;
        const store = database.createObjectStore(BusServicesStore.N, {
          keyPath: ["ServiceNo", "Direction"],
        });
        store.createIndex(BusServicesStore.I_CODE, ["ServiceNo"]);
        store.createIndex(BusServicesStore.I_DESTINATION, ["DestinationCode"]);
        store.createIndex(BusServicesStore.I_ORIGIN, ["OriginCode"]);
      },
    ] satisfies DataStore["upgrader"];
  }

  append(data: BusServiceInfo[]) {
    const database = this.database;
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(BusServicesStore.N, "readwrite");
      data.forEach((item) => {
        transaction.objectStore(BusServicesStore.N).put(item);
      });
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  byPK(serviceNo: string, direction: number) {
    const database = this.database;
    return new Promise<BusServiceInfo>((resolve, reject) => {
      const transaction = database.transaction(BusServicesStore.N, "readonly");
      const request = transaction
        .objectStore(BusServicesStore.N)
        .get(IDBKeyRange.only([serviceNo, direction]));
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
