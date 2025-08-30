export enum DataStore {
  Locations = "locations",
  Meta = "meta",
  Routes = "routes",
  Services = "services",
}

export enum LocationsDataStoreIndex {
  ByLngLat = "byLngLat",
}

export enum ServicesDataStoreIndex {
  ByOrigin = "byOrigin",
  ByDestination = "byDestination",
}

export enum RoutesataStoreIndex {
  ByService = "byService",
  ByLocation = "byLocation",
}
