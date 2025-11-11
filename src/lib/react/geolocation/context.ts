import { createContext } from "react";

export interface GeolocationContext {
  enable(): void;
  getState(): unknown;
}

export const Context = createContext<GeolocationContext>({
  enable() {
    throw new Error();
  },
  getState() {
    throw new Error();
  },
});
