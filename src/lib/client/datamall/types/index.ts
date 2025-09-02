export * from "./enums";

export interface DataSourceSetupContext {
  meta: { from: number; to: number };
  database: IDBDatabase;
}

export interface DatabaseUpgrade {
  description: string;
  rule: { (params: DataSourceSetupContext): boolean };
  worker: {
    (params: DataSourceSetupContext): void;
  };
}
