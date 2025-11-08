import { Component } from "@/lib/service/core";

class DatamallService extends Component {
  static instance = (() => {
    const instance = new DatamallService();
    return instance;
  })();
}

export default DatamallService.instance;
