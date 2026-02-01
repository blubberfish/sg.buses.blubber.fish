import { DataStore } from "./core";

export interface IFavoriteEntry {
  category: string;
  key: string;
}

export class FavoritesStore extends DataStore {
  static readonly N = "@fav";
  static readonly I_CATEGORY = "@cat";

  override get upgrader() {
    return [
      (...params) => {
        const [{ database }] = params;
        const store = database.createObjectStore(FavoritesStore.N, {
          keyPath: ["category", "key"],
        });
        store.createIndex(FavoritesStore.I_CATEGORY, ["category"]);
      },
    ] satisfies DataStore["upgrader"];
  }

  async append(data: IFavoriteEntry) {
    const database = this.database;
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(FavoritesStore.N, "readwrite");
      transaction.objectStore(FavoritesStore.N).put(data);
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  async drop(data: IFavoriteEntry) {
    const database = this.database;
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(FavoritesStore.N, "readwrite");
      transaction
        .objectStore(FavoritesStore.N)
        .delete([data.category, data.key]);
      transaction.oncomplete = () => {
        resolve();
      };
      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  async exists(
    category: IFavoriteEntry["category"],
    key: IFavoriteEntry["key"]
  ): Promise<boolean> {
    const database = this.database;
    return new Promise<boolean>((resolve, reject) => {
      const transaction = database.transaction(FavoritesStore.N, "readwrite");
      const request = transaction
        .objectStore(FavoritesStore.N)
        .count([category, key]);
      request.onsuccess = () => {
        resolve(request.result > 0);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async byCategory(data: IFavoriteEntry["category"]) {
    const database = this.database;
    return new Promise<IFavoriteEntry[]>((resolve, reject) => {
      const transaction = database.transaction(FavoritesStore.N, "readonly");
      const index = transaction
        .objectStore(FavoritesStore.N)
        .index(FavoritesStore.I_CATEGORY);
      const request = index.getAll(data);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async byPK(category: IFavoriteEntry["category"], key: IFavoriteEntry["key"]) {
    const database = this.database;
    return new Promise<IFavoriteEntry>((resolve, reject) => {
      const transaction = database.transaction(FavoritesStore.N, "readonly");
      const store = transaction.objectStore(FavoritesStore.N);
      const request = store.get([category, key]);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
