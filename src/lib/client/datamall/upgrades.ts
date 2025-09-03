"use client";

import {
  DatabaseUpgrade,
  DataStore,
  LocationsDataStoreIndex,
  RoutesataStoreIndex,
  ServicesDataStoreIndex,
} from "./types";

export const UPGRADE_LOG: Array<DatabaseUpgrade> = [
  {
    description: "Database initialization",
    rule(params) {
      return params.meta.from < 1;
    },
    worker({ database }) {
      const locationStore = database.createObjectStore(DataStore.Locations, {
        keyPath: "BusStopCode",
      });

      locationStore.createIndex(LocationsDataStoreIndex.ByLngLat, [
        "Longitude",
        "Latitude",
      ]);

      database.createObjectStore(DataStore.Meta, {
        keyPath: "catalog",
      });
    },
  },
  {
    description: "Database initialization",
    rule(params) {
      return params.meta.from < 2;
    },
    worker({ database }) {
      const serviceStore = database.createObjectStore(DataStore.Services, {
        keyPath: ["ServiceNo", "Direction"],
      });
      serviceStore.createIndex(ServicesDataStoreIndex.ByDestination, [
        "DestinationCode",
      ]);
      serviceStore.createIndex(ServicesDataStoreIndex.ByOrigin, ["OriginCode"]);

      const routeStore = database.createObjectStore(DataStore.Routes, {
        keyPath: ["ServiceNo", "BusStopCode", "Direction", "StopSequence"],
      });
      routeStore.createIndex(RoutesataStoreIndex.ByLocation, ["BusStopCode"]);
      routeStore.createIndex(RoutesataStoreIndex.ByService, ["ServiceNo"]);
    },
  },
  {
    description: "Add favorites store",
    rule(params) {
      return params.meta.from < 3;
    },
    worker({ database }) {
      database.createObjectStore(DataStore.Favorites, {
        keyPath: "id",
      });
    },
  },
];
