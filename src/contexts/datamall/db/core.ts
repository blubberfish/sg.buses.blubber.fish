import { DataStore } from "./store/core";

export interface IDatamallDBInit {
  use<
    TPlugin extends DataStore,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TPluginClass extends { new (...args: any[]): TPlugin }
  >(
    Plugin: TPluginClass,
    ...args: ConstructorParameters<TPluginClass>
  ): IDatamallDBInit;
}

export class DatamallDB {
  static #DB_NAME = "blubberfish-datamall";
  static #DB_VERSION = 1;

  readonly notification = new EventTarget();

  #plugins = new Map<(typeof DataStore)["id"], DataStore>();

  #ready?: Promise<IDBDatabase>;

  setup(init: { (builder: IDatamallDBInit): void }): this {
    console.debug("DatamallDB: setup called");
    if (this.#ready) {
      console.debug("DatamallDB: exiting early, already initialized");
      return this;
    }
    const plugins = this.#plugins;
    this.#ready = new Promise<IDBDatabase>((resolve, reject) => {
      console.debug("DatamallDB: preparing plugins");
      init({
        use<
          TPlugin extends DataStore,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          TPluginClass extends { new (...args: any[]): TPlugin }
        >(Plugin: TPluginClass, ...args: ConstructorParameters<TPluginClass>) {
          plugins.set(
            (Plugin as unknown as typeof DataStore).id,
            new Plugin(...args)
          );
          return this;
        },
      } satisfies IDatamallDBInit);
      console.debug("DatamallDB: plugins prepared");
      const request = indexedDB.open(
        DatamallDB.#DB_NAME,
        DatamallDB.#DB_VERSION
      );
      request.onupgradeneeded = ({ oldVersion, newVersion }) => {
        console.debug("DatamallDB: upgrade in progress");
        plugins.forEach((plugin) => {
          plugin.setup({
            database: request.result,
            version: oldVersion,
            targetVersion: newVersion || 1,
          });
        });
        console.debug("DatamallDB: upgrade done");
      };
      request.onsuccess = () => {
        plugins.forEach((plugin) => {
          plugin.database = request.result;
        });
        console.debug("DatamallDB: done");
        resolve(request.result);
      };
      request.onerror = () => {
        console.debug("Error", { reason: request.error });
        reject(request.error);
      };
    });
    return this;
  }

  async using<
    TStore extends DataStore,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TStoreClass extends { new (...args: any[]): TStore }
  >(Store: TStoreClass): Promise<InstanceType<TStoreClass>> {
    await this.#ready;
    const target = this.#plugins.get((Store as unknown as typeof DataStore).id);
    return target as InstanceType<TStoreClass>;
  }
}
