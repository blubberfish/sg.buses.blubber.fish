import { Component } from "@/lib/service/core";
import { RestAPIService } from "./rest";

class DatamallService extends Component {
  static instance = (() => {
    const service = new DatamallService();
    service.register(RestAPIService);
    return service;
  })();
}

export default DatamallService.instance;
export * from "./rest";
