import { DatamallDBError } from "../../error";

export abstract class DataStore {
  static isType(target: unknown): boolean {
    if (!target) return false;
    if (target === DataStore) return true;
    return DataStore.isType(Object.getPrototypeOf(target));
  }

  static get id(): string {
    const key = Symbol.for("__datamall_data_plugin__");
    if (Object.hasOwnProperty.call(this, key)) {
      return (this as unknown as Record<symbol, string>)[key];
    }
    const value = [
      Date.now().toString(36),
      Math.random().toString(36).slice(2),
    ].join("-");
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: false,
      writable: false,
      value,
    });
    return value;
  }

  static idOf(target: unknown) {
    if (target instanceof DataStore) {
      return (DataStore.constructor as typeof DataStore).id;
    }
    if (!DataStore.isType(target)) {
      throw new DatamallDBError();
    }
    return (target as typeof DataStore).id;
  }

  abstract get upgrader(): {
    (...params: Parameters<DataStore["setup"]>): void;
  }[];

  #database?: IDBDatabase;

  get database(): IDBDatabase {
    if (!this.#database) {
      throw new DatamallDBError("Database not initialized");
    }
    return this.#database;
  }

  set database(database: IDBDatabase) {
    if (this.#database && this.#database !== database) {
      throw new DatamallDBError("Unable to change database");
    }
    this.#database = database;
  }

  setup(context: {
    database: IDBDatabase;
    version: number;
    targetVersion: number;
  }): void {
    const upgrader = this.upgrader;
    const { database, version, targetVersion } = context;
    this.#database = database;
    for (let i = version; i < targetVersion; i++) {
      const upgradeFunction = upgrader[i];
      if (!upgradeFunction) {
        continue;
      }
      upgradeFunction(context);
    }
  }
}
