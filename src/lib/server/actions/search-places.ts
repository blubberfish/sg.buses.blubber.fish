"use server";

import { DEFAULT_POSITION_BIAS } from "@/lib/constants";

export interface PlaceInfo {
  Distance: number;
  Place: {
    AddressNumber: string;
    Country: string;
    Geometry: {
      Point: number[];
    };
    Interpolated: boolean;
    Label: string;
    LocationType: string;
    Municipality: string;
    Neighborhood: string;
    PostalCode: string;
    Street: string;
    SubRegion: string;
    TimeZone: {
      Name: string;
      Offset: number;
    };
  };
  PlaceId: string;
  Relevance: number;
}

export interface SearchPlacesResult {
  query: {
    address: string;
    bias: number[];
  };
  result: PlaceInfo[];
}

export interface SearchPlacesState {
  error?: string;
  result?: SearchPlacesResult;
}

export async function searchPlaces(
  prevState: unknown,
  formData?: FormData | null
): Promise<SearchPlacesState> {
  if (!formData) {
    return {};
  }

  const url = new URL(
    "https://jn4dhjceva.execute-api.ap-southeast-1.amazonaws.com/prod/api/v1/sg/location"
  );
  url.searchParams.set("address", formData.get("address") as string);
  url.searchParams.set(
    "longitude",
    DEFAULT_POSITION_BIAS.SINGAPORE.LONGITUDE.toString()
  );
  url.searchParams.set(
    "latitude",
    DEFAULT_POSITION_BIAS.SINGAPORE.LATITUDE.toString()
  );

  const apiKey = process.env.BLUBBERFISH_API_KEY;
  if (!apiKey) {
    return {
      error: "Server error",
    };
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  });

  if (response.ok) {
    const result = (await response.json()) as SearchPlacesResult;
    return {
      result,
    };
  }

  return {
    error: `API error - ${response.status}: ${(await response.text()) || ""}`,
  };
}
