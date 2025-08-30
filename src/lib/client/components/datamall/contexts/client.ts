"use client";

import { DataClient } from "@/lib/client/datamall";
import { createContext, useContext } from "react";

const DataContext = createContext(DataClient.instance);

export function useDataMall() {
  return useContext(DataContext);
}
