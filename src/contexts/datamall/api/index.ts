import { DatamallAPIError } from "../error";
import type {
  BusRouteInfo,
  BusServiceInfo,
  BusStopArrivalInfo,
  BusStopInfo,
  Values,
} from "./types";

const CONFIG = {
  RESOURCE: {
    ARRIVALS: "/ltaodataservice/v3/BusArrival",
    ROUTES: "/ltaodataservice/BusRoutes",
    SERVICES: "/ltaodataservice/BusServices",
    STOPS: "/ltaodataservice/BusStops",
  } as const,
  HEADERS: {
    AccountKey: process.env.DATAMALL_APIKEY!,
    accept: "application/json",
  },
};

export function api() {
  const base = new URL(process.env.DATAMALL_HOST!);
  return {
    async routes(skip = 0): Promise<Values<BusRouteInfo>> {
      const url = new URL(CONFIG.RESOURCE.ROUTES, base);
      url.searchParams.set("$skip", String(skip));
      const response = await fetch(url.toString(), {
        headers: CONFIG.HEADERS,
        next: {
          revalidate: 30 * 24 * 60 * 60,
        },
      });
      if (!response.ok) throw new DatamallAPIError("Failed to fetch routes");
      return response.json();
    },
    async services(skip = 0): Promise<Values<BusServiceInfo>> {
      const url = new URL(CONFIG.RESOURCE.SERVICES, base);
      url.searchParams.set("$skip", String(skip));
      const response = await fetch(url.toString(), {
        headers: CONFIG.HEADERS,
        next: {
          revalidate: 30 * 24 * 60 * 60,
        },
      });
      if (!response.ok)
        throw new DatamallAPIError("Failed to fetch bus services");
      return response.json();
    },
    async stops(skip = 0): Promise<Values<BusStopInfo>> {
      const url = new URL(CONFIG.RESOURCE.STOPS, base);
      url.searchParams.set("$skip", String(skip));
      const response = await fetch(url.toString(), {
        headers: CONFIG.HEADERS,
        next: {
          revalidate: 30 * 24 * 60 * 60,
        },
      });
      if (!response.ok) throw new DatamallAPIError("Failed to fetch bus stops");
      return response.json();
    },
    async arrival(id: string): Promise<BusStopArrivalInfo> {
      const url = new URL(CONFIG.RESOURCE.ARRIVALS, base);
      url.searchParams.set("BusStopCode", id);
      const response = await fetch(url.toString(), {
        headers: CONFIG.HEADERS,
        next: {
          revalidate: 2 * 60,
        },
      });
      if (!response.ok) throw new DatamallAPIError("Failed to fetch bus stops");
      return response.json();
    },
  };
}

export default api();
