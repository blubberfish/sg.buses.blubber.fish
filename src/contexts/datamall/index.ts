import { createContext } from "react";
import { DatamallDB } from "./db";

export interface IDatamallContext {
  db(): DatamallDB;
  getReport(type: "ready", context: "data:bus-route"): boolean;
  getReport(type: "ready", context: "data:bus-stop"): boolean;
  getReport(type: "ready", context: "data:bus-service"): boolean;
}

export const DatamallContext = createContext<IDatamallContext>({
  db() {
    throw new Error("DatamallContext not provided");
  },
  getReport() {
    throw new Error("DatamallContext not provided");
  },
});
