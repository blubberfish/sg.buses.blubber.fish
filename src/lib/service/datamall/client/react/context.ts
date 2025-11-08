import DatamallService from "@/lib/service/datamall/client";
import { createContext, useContext } from "react";

export const DatamallContext = createContext(DatamallService);

export function useDatamall() {
  return useContext(DatamallContext);
}
