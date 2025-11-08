import { Component, RestService } from "@/lib/service/core";

export class RestAPIService extends Component {
  get provider() {
    const restService = this.find(RestService);
    return restService.server(document.location.href);
  }
}
