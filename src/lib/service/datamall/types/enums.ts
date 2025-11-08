export enum DataStore {
  Locations = "locations",
  Meta = "meta",
  Routes = "routes",
  Services = "services",
  Favorites = "favorites",
}

export enum LocationsDataStoreIndex {
  ByLngLat = "byLngLat",
}

export enum ServicesDataStoreIndex {
  ByOrigin = "byOrigin",
  ByDestination = "byDestination",
}

export enum RoutesDataStoreIndex {
  ByService = "byService",
  ByLocation = "byLocation",
}
