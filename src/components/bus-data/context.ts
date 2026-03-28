import { createContext } from "react";
import { DatamallDB } from "./database";

export const BusDataContext = createContext<DatamallDB | null>(null);

export const BusDataReadinessContext = createContext<{
  routes: boolean;
  routesReady: () => void;
  services: boolean;
  servicesReady: () => void;
  stops: boolean;
  stopsReady: () => void;
}>({
  routes: false,
  routesReady: () => {},
  services: false,
  servicesReady: () => {},
  stops: false,
  stopsReady: () => {},
});
