"use client"

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

export const STATE = {
  LOADING: 0,
  READY: 1,
} as const;

type StateType = (typeof STATE)[keyof typeof STATE];

interface DataState {
  busRoutes?: StateType;
  busServices?: StateType;
  busStopLoctions?: StateType;
}

interface PageContext extends DataState {
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

const Context = createContext<PageContext>({
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

export default function PageContext({ children }: PropsWithChildren) {
  const [state, setState] = useState<DataState>({});
  const set: PageContext["set"] = useCallback((data, state) => {
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

export function usePageContext() {
  return useContext(Context);
}
