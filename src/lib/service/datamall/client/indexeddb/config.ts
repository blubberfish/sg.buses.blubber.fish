export interface StoreConfiguration {
  store: string;
  key: string | string[];
  indexes?: {
    [key: string]: {
      index: string;
      key: string | string[];
    };
  };
}

export const DATABASE_DESCRIPTOR = {
  BUS_ROUTES: {
    store: "busroutes",
    key: ["ServiceNo", "BusStopCode", "Direction", "StopSequence"],
    indexes: {
      SERVICE: {
        index: "byService",
        key: "ServiceNo",
      },
      BUS_STOP: {
        index: "byBusStop",
        key: "BusStopCode",
      },
    },
  } satisfies StoreConfiguration,
  BUS_STOPS: {
    store: "busstops",
    key: "BusStopCode",
    indexes: {
      SPATIAL: {
        index: "byLngLat",
        key: ["Longitude", "Latitude"],
      },
    },
  } satisfies StoreConfiguration,
  BUS_SERVICES: {
    store: "busservices",
    key: "ServiceNo",
    indexes: {
      DESTINATION: {
        index: "byDestination",
        key: "DestinationCode",
      },
      ORIGIN: {
        index: "byOrigin",
        key: "OriginCode",
      },
    },
  } satisfies StoreConfiguration,
  META: {
    store: "meta",
    key: "catalog",
  } satisfies StoreConfiguration,
} as const;
