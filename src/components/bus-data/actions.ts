"use server";

import assert from "assert";
import type {
  BusRouteInfo,
  BusServiceInfo,
  BusStopArrivalInfo,
  BusStopInfo,
  Values,
} from "./types";

const { DATAMALL_HOST, DATAMALL_APIKEY, DATAMALL_API_VERSION } = process.env;

assert(DATAMALL_HOST, "DATAMALL_HOST is not defined");
assert(DATAMALL_APIKEY, "DATAMALL_APIKEY is not defined");
assert(DATAMALL_API_VERSION, "DATAMALL_API_VERSION is not defined");

export async function listBusStops({ offset }: { offset?: number } = {}) {
  const target = new URL("/ltaodataservice/BusStops", DATAMALL_HOST!);
  target.searchParams.set("$skip", String(offset ?? 0));
  const response = await fetch(target, {
    method: "GET",
    headers: {
      AccountKey: DATAMALL_APIKEY!,
      accept: "application/json",
    },
    next: {
      revalidate: 2592000, // 30 days
    },
  });
  if (!response.ok) {
    throw new Error(
      `${response.status} - ${response.statusText}\n${await response.text()}`,
    );
  }
  return response.json() as Promise<Values<BusStopInfo>>;
}

export async function listBusRoutes({ offset }: { offset?: number } = {}) {
  const target = new URL("/ltaodataservice/BusRoutes", DATAMALL_HOST!);
  target.searchParams.set("$skip", String(offset ?? 0));
  const response = await fetch(target, {
    method: "GET",
    headers: {
      AccountKey: DATAMALL_APIKEY!,
      accept: "application/json",
    },
    next: {
      revalidate: 2592000, // 30 days
    },
  });
  if (!response.ok) {
    throw new Error(
      `${response.status} - ${response.statusText}\n${await response.text()}`,
    );
  }
  return response.json() as Promise<Values<BusRouteInfo>>;
}

export async function listBusServices({ offset }: { offset?: number } = {}) {
  const target = new URL("/ltaodataservice/BusServices", DATAMALL_HOST!);
  target.searchParams.set("$skip", String(offset ?? 0));
  const response = await fetch(target, {
    method: "GET",
    headers: {
      AccountKey: DATAMALL_APIKEY!,
      accept: "application/json",
    },
    next: {
      revalidate: 2592000, // 30 days
    },
  });
  if (!response.ok) {
    throw new Error(
      `${response.status} - ${response.statusText}\n${await response.text()}`,
    );
  }
  return response.json() as Promise<Values<BusServiceInfo>>;
}

export async function getBusArrival(busStopCode: string) {
  const target = new URL("/ltaodataservice/v3/BusArrival", DATAMALL_HOST!);
  target.searchParams.set("BusStopCode", busStopCode);
  const response = await fetch(target, {
    method: "GET",
    headers: {
      AccountKey: DATAMALL_APIKEY!,
      accept: "application/json",
    },
    next: {
      revalidate: 120, // 2 minutes
    },
  });
  if (!response.ok) {
    throw new Error(
      `${response.status} - ${response.statusText}\n${await response.text()}`,
    );
  }
  return response.json() as Promise<BusStopArrivalInfo>;
}