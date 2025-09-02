"use client";

import { DataStore } from "@/lib/client/datamall";
import {
  createContext,
  type PropsWithChildren,
  Suspense,
  useCallback,
  useContext,
  useState,
} from "react";

export const STATE = {
  LOADING: 0,
  READY: 1,
} as const;

type StateType = (typeof STATE)[keyof typeof STATE];

type DataState = {
  [key in DataStore]?: StateType;
};

interface DataContext extends DataState {
  set: {
    (data: keyof DataState, state: StateType): void;
  };
  on: {
    (dataSource: "userLocation", callback: { (): void }): void;
  };
  off: {
    (dataSource: "userLocation", callback: { (): void }): void;
  };
}

const Context = createContext<DataContext>({
  set() {
    throw new Error("Missing page context");
  },
  on() {
    throw new Error("Missing page context");
  },
  off() {
    throw new Error("Missing page context");
  },
});

function Provider({ children }: PropsWithChildren) {
  const [state, setState] = useState<DataState>({});
  const set: DataContext["set"] = useCallback((data, state) => {
    setState((current) => ({
      ...current,
      [data]: state,
    }));
  }, []);

  return (
    <Context.Provider
      value={{
        ...state,
        set,
        on() {},
        off() {},
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function DataContext(props: PropsWithChildren) {
  return (
    <Suspense>
      <Provider {...props} />
    </Suspense>
  );
}

export function useDataContext() {
  return useContext(Context);
}
