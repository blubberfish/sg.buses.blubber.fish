import { ONE_DAY } from "@/lib/constants";
import { Component } from "@/lib/service/core";
import { IDBService } from "./indexeddb";
import { DATABASE_DESCRIPTOR } from "./indexeddb/config";
import { DatamallRestAPIService } from "./rest";
import { MetaRecord } from "./common";

export class DatamallBusStopService extends Component {
  static EVENT_READY = "service:ready";
  static EVENT_REFRESH = "service:refresh";

  #setup?: Promise<void>;

  #lastRecord?: number;

  async setup() {
    if (!this.#setup) {
      const rest = this.find(DatamallRestAPIService);
      const db = this.find(IDBService);
      this.#setup = new Promise<void>(async (resolve) => {
        const record = await db.queryOne<MetaRecord>(
          DATABASE_DESCRIPTOR.META.store,
          {
            filter: DATABASE_DESCRIPTOR.BUS_ROUTES.store,
          }
        );

        this.#lastRecord = record?.timestamp;
        if (this.#lastRecord && Date.now() - this.#lastRecord < ONE_DAY) {
          this.dispatchEvent(
            new Event(DatamallBusStopService.EVENT_READY)
          );
          return;
        } else if (this.#lastRecord) {
          this.dispatchEvent(
            new Event(DatamallBusStopService.EVENT_REFRESH)
          );
        }

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
        await db.put(DATABASE_DESCRIPTOR.META.store, {
          catelog: DATABASE_DESCRIPTOR.BUS_STOPS.store,
          timestamp: Date.now(),
        });
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
