"use client";
import DatamallService from "@/lib/service/datamall/client";
import { PropsWithChildren, useCallback, useState } from "react";
import { DatamallContext, DatamallState, DataState } from "./context";
import { BusRouteLoader } from "./components/bus-route-loader";
import { BusServiceLoader } from "./components/bus-service-loader";
import { BusStopLoader } from "./components/bus-stop-loader";
import { Status } from "./components/status";
import { Row, Table } from "./components/table";

const LABEL_MAP: { [key in keyof DatamallState]: string } = {
  locations: "Locations",
  routes: "Routes",
  services: "Services",
};

const STATE_LABEL_MAP: { [key in DataState]: string } = {
  loading: "Preparing",
  refreshing: "Updating",
  ready: "Ready",
};

export function BusInfoLoaders({ children }: PropsWithChildren) {
  const [expand, setExpand] = useState(false);
  const [state, setState] = useState<DatamallState>({
    locations: "loading",
    routes: "loading",
    services: "loading",
  });

  const getDataState = useCallback(() => state, [state]);

  const updateDataState = useCallback(
    (key: keyof DatamallState, value: DataState) => {
      setState((current) => {
        if (value === current[key]) return current;
        return {
          ...current,
          [key]: value,
        };
      });
    },
    [setState]
  );

  const getService = useCallback(() => DatamallService.instance, []);

  const pending =
    Object.values(state).filter((s: DataState) => s !== "ready").length > 0;

  return (
    <DatamallContext.Provider
      value={{
        getDataState,
        updateDataState,
        getService,
      }}
    >
      {children}
      <BusRouteLoader />
      <BusServiceLoader />
      <BusStopLoader />
      {pending && (
        <div
          className={`fixed bottom-3 right-3 bg-gray-600 grid grid-cols-[max-content_1fr] ${
            expand
              ? "grid-rows-[min-content_1fr]"
              : "grid-rows-[min-content_0fr]"
          } opacity-50 hover:opacity-100`}
          onClick={() => {
            setExpand((current) => !current);
          }}
        >
          <header className="col-start-1 col-span-full grid grid-cols-subgrid items-center px-3 py-1 bg-gray-600">
            <Status loading={pending} />
            <p className="ml-3">Preparing bus information</p>
          </header>
          <Table>
            {Object.entries(state).map(([key, value]) => (
              <Row key={key}>
                <p className="text-sm">
                  {LABEL_MAP[key as keyof typeof LABEL_MAP]}
                </p>
                <p className={`text-xs text-violet-300`}>
                  {STATE_LABEL_MAP[value as DataState]}
                </p>
              </Row>
            ))}
          </Table>
        </div>
      )}
    </DatamallContext.Provider>
  );
}
