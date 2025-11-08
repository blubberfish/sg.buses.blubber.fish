import { Component, RestService } from "@/lib/service/core";

export class DatamallRestAPIService extends Component {
  get provider() {
    const restService = this.find(RestService);
    return restService.server(document.location.href);
  }

  getBusStops(offset?: number) {
    return this.provider.get("/api/v1/datamall/locations", {
      search: new URLSearchParams([["skip", (offset || 0).toFixed(0)]]),
    });
  }

  getBusServices(offset?: number) {
    return this.provider.get("/api/v1/datamall/services", {
      search: new URLSearchParams([["skip", (offset || 0).toFixed(0)]]),
    });
  }

  getBusRoutes(offset?: number) {
    return this.provider.get("/api/v1/datamall/services/routes", {
      search: new URLSearchParams([["skip", (offset || 0).toFixed(0)]]),
    });
  }
}
