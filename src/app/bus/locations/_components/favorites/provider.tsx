import { createContext, useContext } from "react";
import { useFavoritesState } from "./hooks";

const Context = createContext<ReturnType<typeof useFavoritesState>>(
  Object.defineProperties(
    {} as unknown as ReturnType<typeof useFavoritesState>,
    {
      data: {
        get() {
          throw new Error("Missing FavoritesProvider");
        },
      },
      loading: {
        get() {
          throw new Error("Missing FavoritesProvider");
        },
      },
      toggle: {
        get() {
          throw new Error("Missing FavoritesProvider");
        },
      },
    }
  )
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const state = useFavoritesState();
  return <Context.Provider value={state}>{children}</Context.Provider>;
}

export function useFavorites() {
  return useContext(Context);
}
