import { Component } from "@/lib/service/core";
import { IDBService } from "./indexeddb";
import { DATABASE_DESCRIPTOR } from "./indexeddb/config";
import { DatamallRestAPIService } from "./rest";

export class DatamallBusStopService extends Component {
  static EVENT_READY = "service:ready";

  #setup?: Promise<void>;

  async setup() {
    if (!this.#setup) {
      const rest = this.find(DatamallRestAPIService);
      const db = this.find(IDBService);
      this.#setup = new Promise<void>(async (resolve) => {
        let offset = 0;
        while (true) {
          const response = await rest.getBusStops(offset);
          if (response.ok) {
            const { value } = (await response.json()) as {
              value: Array<unknown>;
            };
            await db.put(DATABASE_DESCRIPTOR.BUS_STOPS.store, ...value);
            offset += value.length;
            if (value.length <= 0) {
              break;
            }
          }
        }
        resolve();
      });
    }
    this.#setup.then(() => {
      this.dispatchEvent(
        new CustomEvent(DatamallBusStopService.EVENT_READY, {
          detail: { done: true },
        })
      );
    });
  }
}
