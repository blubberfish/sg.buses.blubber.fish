import { Component } from "@/lib/service/core";
import { IDBService } from "./indexeddb";
import { DATABASE_DESCRIPTOR } from "./indexeddb/config";
import { DatamallRestAPIService } from "./rest";

export class DatamallBusRoutesService extends Component {
  static EVENT_READY = "service:ready";

  #setup?: Promise<void>;

  async setup() {
    if (!this.#setup) {
      const rest = this.find(DatamallRestAPIService);
      const db = this.find(IDBService);
      this.#setup = new Promise<void>(async (resolve) => {
        let offset = 0;
        while (true) {
          const response = await rest.getBusRoutes(offset);
          if (response.ok) {
            const { value } = (await response.json()) as {
              value: Array<unknown>;
            };
            await db.put(DATABASE_DESCRIPTOR.BUS_ROUTES.store, ...value);
            offset += value.length;
            if (value.length <= 0) {
              break;
            }
          }
        }
        await db.put(DATABASE_DESCRIPTOR.META.store, {
          catelog: DATABASE_DESCRIPTOR.BUS_ROUTES.store,
          timestamp: Date.now(),
        });
        resolve();
      });
    }
    this.#setup.then(() => {
      this.dispatchEvent(
        new CustomEvent(DatamallBusRoutesService.EVENT_READY, {
          detail: { done: true },
        })
      );
    });
  }
}
