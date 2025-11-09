import { ONE_DAY } from "@/lib/constants";
import { Component } from "@/lib/service/core";
import { IDBService } from "./indexeddb";
import { DATABASE_DESCRIPTOR } from "./indexeddb/config";
import { DatamallRestAPIService } from "./rest";
import { MetaRecord } from './common'

export class DatamallBusRoutesService extends Component {
  static EVENT_STATUS_READY = "service:status:ready";
  static EVENT_STATUS_REFRESHING = "service:status:refreshing";

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
            new Event(DatamallBusRoutesService.EVENT_STATUS_READY)
          );
          return;
        } else if (this.#lastRecord) {
          this.dispatchEvent(
            new Event(DatamallBusRoutesService.EVENT_STATUS_REFRESHING)
          );
        }

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
        new Event(DatamallBusRoutesService.EVENT_STATUS_READY)
      );
    });
  }
}
