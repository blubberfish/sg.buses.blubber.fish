"use client";

import { DataClient } from "@/lib/client/datamall";
import React, { createContext, useContext, useMemo } from "react";

const DataContext = createContext<DataClient | undefined>(undefined);

export function useDataMall() {
  const client = useContext(DataContext);
  if (!client) throw new Error("Missing <DataMallProvider>");
  return client;
}

export function DataMallProvider({ children }: React.PropsWithChildren) {
  const client = useMemo(() => new DataClient(), []);
  return <DataContext.Provider value={client}>{children}</DataContext.Provider>;
}
