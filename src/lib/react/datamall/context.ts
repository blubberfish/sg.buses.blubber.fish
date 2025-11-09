"use client";
import DatamallService from "@/lib/service/datamall/client";
import { createContext, useContext } from "react";

export type DataState = "loading" | "refreshing" | "ready";

export interface DatamallState {
  locations: DataState;
  routes: DataState;
  services: DataState;
}

export interface DatamallContext {
  getDataState(): DatamallState;
  updateDataState(key: keyof DatamallState, value: DataState): void;
  getService(): DatamallService;
}

export const DatamallContext = createContext<DatamallContext>({
  getDataState() {
    throw new Error();
  },
  updateDataState() {
    throw new Error();
  },
  getService() {
    throw new Error();
  },
});

export function useDatamall() {
  return useContext(DatamallContext);
}
