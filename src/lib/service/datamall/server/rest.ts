import { SERVER_CACHE_ONE_DAY, SERVER_CACHE_ONE_MINUTE } from "@/lib/constants";
import { Component, RestService } from "@/lib/service/core";

export class RestAPIService extends Component {
  headers = {
    AccountKey: process.env.DATAMALL_APIKEY || "",
    accept: "application/json",
  };

  get provider() {
    const restService = this.find(RestService);
    return restService.server(process.env["DATAMALL_HOST"]!);
  }

  async getBusStops(options?: { skip: number }) {
    return this.provider.get("/ltaodataservice/BusStops", {
      headers: {
        ...this.headers,
      },
      search: new URLSearchParams([["$skip", (options?.skip || 0).toFixed(0)]]),
      next: {
        revalidate: 30 * SERVER_CACHE_ONE_DAY,
      },
    });
  }

  async getBusRoutes(options?: { skip: number }) {
    return this.provider.get("/ltaodataservice/BusRoutes", {
      headers: {
        ...this.headers,
      },
      search: new URLSearchParams([["$skip", (options?.skip || 0).toFixed(0)]]),
      next: {
        revalidate: SERVER_CACHE_ONE_DAY,
      },
    });
  }

  async getBusServices(options?: { skip: number }) {
    return this.provider.get("/ltaodataservice/BusServices", {
      headers: {
        ...this.headers,
      },
      search: new URLSearchParams([["$skip", (options?.skip || 0).toFixed(0)]]),
      next: {
        revalidate: 30 * SERVER_CACHE_ONE_DAY,
      },
    });
  }

  async getBusArrival(options?: { id: string }) {
    return this.provider.get("ltaodataservice/v3/BusArrival", {
      headers: {
        ...this.headers,
      },
      search: new URLSearchParams([["BusStopCode", options?.id || ""]]),
      next: {
        revalidate: 2 * SERVER_CACHE_ONE_MINUTE,
      },
    });
  }
}
