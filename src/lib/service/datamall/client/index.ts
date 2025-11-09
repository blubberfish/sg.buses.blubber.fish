"use client";
import { Component, RestService } from "@/lib/service/core";
import { IDBService } from "./indexeddb";
import { DatamallBusRoutesService } from "./bus-routes";
import { DatamallBusServiceService } from "./bus-services";
import { DatamallBusStopService } from "./bus-stops";
import { DatamallRestAPIService } from "./rest";

class DatamallService extends Component {
  static #instance?: DatamallService;

  static get instance() {
    if (this.#instance) {
      return this.#instance;
    }
    const service = new DatamallService();
    service.register(IDBService);
    service.register(RestService);
    service.register(DatamallBusRoutesService);
    service.register(DatamallBusServiceService);
    service.register(DatamallBusStopService);
    service.register(DatamallRestAPIService);
    this.#instance = service;
    return service;
  }
}

export default DatamallService;
export * from "./bus-routes";
export * from "./bus-services";
export * from "./bus-stops";
export * from "./rest";
