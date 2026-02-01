import { bbox } from "@turf/bbox";
import { destination } from "@turf/destination";
import { featureCollection } from "@turf/helpers";
import type { BusStopInfo } from "../../api/types";
import { DataStore } from "./core";

export class BusStopsStore extends DataStore {
  static readonly N = "@bstp";
  static readonly I_GEO = "@geo";

  override get upgrader() {
    return [
      (...params) => {
        const [{ database }] = params;
        const store = database.createObjectStore(BusStopsStore.N, {
          keyPath: "BusStopCode",
        });
        store.createIndex(BusStopsStore.I_GEO, ["Longitude", "Latitude"]);
      },
    ] satisfies DataStore["upgrader"];
  }

  async append(data: BusStopInfo[]) {
    const database = this.database;
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(BusStopsStore.N, "readwrite");
      data.forEach((item) => {
        transaction.objectStore(BusStopsStore.N).put(item);
      });
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  async byPK(id: string): Promise<BusStopInfo> {
    const database = this.database;
    return new Promise<BusStopInfo>((resolve, reject) => {
      const transaction = database.transaction(BusStopsStore.N, "readonly");
      const request = transaction.objectStore(BusStopsStore.N).get(id);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async byGeo({ center }: { center: number[] }): Promise<BusStopInfo[]> {
    const box = bbox(
      featureCollection([
        destination(center, 500, 0, { units: "meters" }), // N
        destination(center, 500, -90, { units: "meters" }), // W
        destination(center, 500, 90, { units: "meters" }), // E
        destination(center, 500, 180, { units: "meters" }), // S
      ])
    );
    return new Promise<BusStopInfo[]>((resolve, reject) => {
      const transaction = this.database.transaction(
        [BusStopsStore.N],
        "readonly"
      );
      const results: BusStopInfo[] = [];
      const cursorRequest = transaction
        .objectStore(BusStopsStore.N)
        .index(BusStopsStore.I_GEO)
        .openCursor(IDBKeyRange.bound([box[0], box[1]], [box[2], box[3]]));

      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (!cursor) {
          resolve(results);
          return;
        }
        const { Longitude, Latitude } = cursor.value;
        if (
          Longitude >= box[0] &&
          Longitude <= box[2] &&
          Latitude >= box[1] &&
          Latitude <= box[3]
        ) {
          results.push(cursor.value);
        }
        cursor.continue();
      };

      cursorRequest.onerror = (event) => {
        reject((event.target as IDBRequest<IDBCursorWithValue>).error);
      };
    });
  }
}
