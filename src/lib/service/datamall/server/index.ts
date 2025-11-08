import { Component, RestService } from "@/lib/service/core";
import { DatamallRestAPIService } from "./rest";

class DatamallService extends Component {
  static instance = (() => {
    const service = new DatamallService();
    service.register(RestService);
    service.register(DatamallRestAPIService);
    return service;
  })();
}

export default DatamallService.instance;
export * from "./rest";
