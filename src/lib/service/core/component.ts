import { ComponentError } from "./error";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class Component extends EventTarget {
  static get __idProp() {
    return "__componentid";
  }

  static get id() {
    let id: string | undefined = (this as unknown as Record<string, string>)[
      this.__idProp
    ];
    if (id) {
      return id;
    }
    id = crypto.randomUUID();
    Object.defineProperty(this, this.__idProp, {
      configurable: false,
      enumerable: false,
      get() {
        return id;
      },
    });
    return id;
  }

  #registry = new Map<string, Component>();

  #mergeRegistry(...source: Map<string, Component>[]): (typeof source)[number] {
    return new Map(
      source.flatMap((registry) => Array.from(registry.entries()))
    );
  }

  register<T extends Component, Ctor extends { new (...args: any[]): T }>(
    component: Ctor,
    ...args: ConstructorParameters<Ctor>
  ): InstanceType<Ctor> {
    const id = (component as unknown as typeof Component).id;
    if (this.#registry.has(id)) {
      throw new ComponentError();
    }
    const componentInstance = new component(...args);
    componentInstance.#registry = this.#registry;
    this.#registry.set(id, componentInstance);
    return componentInstance as InstanceType<Ctor>;
  }

  find<T extends Component, Ctor extends { new (...args: any[]): T }>(
    component: Ctor
  ): InstanceType<Ctor> {
    const id = (component as unknown as typeof Component).id;
    const componentInstance = this.#registry.get(id) as InstanceType<Ctor>;
    if (!componentInstance) {
      throw new ComponentError();
    }
    return componentInstance;
  }
}
