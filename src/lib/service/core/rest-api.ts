import { Component } from "./component";

type RestMethods =
  | "delete"
  | "get"
  | "head"
  | "option"
  | "patch"
  | "post"
  | "put";

export type EnhancedFetch = {
  (
    path: string,
    options?: Omit<RequestInit, "method"> & { search?: URLSearchParams }
  ): Promise<Response>;
};

export type RestInterface = {
  [method in RestMethods]: EnhancedFetch;
};

export class RestService extends Component {
  static get delete() {
    return "DELETE";
  }

  static get get() {
    return "GET";
  }

  static get head() {
    return "HEAD";
  }

  static get option() {
    return "OPTION";
  }

  static get patch() {
    return "PATCH";
  }

  static get put() {
    return "PUT";
  }

  static get post() {
    return "POST";
  }

  static createRestAPI(server: string) {
    const base = new URL("", server);
    const rest = new Proxy(this.constructor as typeof RestService, {
      get(target, method) {
        return (
          path: string,
          options?: RequestInit & { search?: URLSearchParams }
        ) => {
          const url = new URL(path, base);
          if (options?.search) {
            url.search = new URLSearchParams([
              ...Array.from(url.searchParams.entries()),
              ...Array.from(options.search.entries()),
            ]).toString();
          }
          return fetch(url, {
            ...options,
            method: target[method as RestMethods],
          });
        };
      },
    }) as unknown as RestInterface;
    return rest;
  }

  #registry = new Map<string, RestInterface>();

  server(endpoint: string) {
    const base = new URL("", endpoint);
    let rest = this.#registry.get(base.href);
    if (!rest) {
      rest = RestService.createRestAPI(endpoint);
      this.#registry.set(base.href, rest);
    }
    return rest;
  }
}
