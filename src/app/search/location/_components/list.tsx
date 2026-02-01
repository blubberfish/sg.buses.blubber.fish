function assert(condition: boolean, message?: string): Error | undefined {
  if (condition) return;
  return new Error(message || "Assertion failed");
}

export interface PlaceIndex {
  Place: {
    AddressNumber: string;
    Country: string;
    Geometry: {
      Point: [number, number];
    };

    Interpolated: boolean;
    Label: string;
    Municipality: string;
    Neighborhood: string;
    PostalCode: string;
    Region: string;
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

export interface IListData {
  query: { address: string; longitude?: string; latitude?: string };
  result: PlaceIndex[];
}

export async function List({
  address,
  longitude,
  latitude,
  renderError,
  renderData,
}: {
  address: string;
  longitude?: string | null;
  latitude?: string | null;
  renderError?: { (): React.ReactNode };
  renderData: { (data: IListData): React.ReactNode };
}) {
  const apiUrl = process.env["AWS_LOCATION_API_GATEWAY"]!;
  const apiKey = process.env["BLUBBERFISH_API_KEY"]!;
  if (assert(!!apiUrl) instanceof Error || assert(!!apiKey) instanceof Error) {
    return renderError?.() || null;
  }

  const endpoint = new URL("prod/api/v1/sg/location", apiUrl);
  endpoint.searchParams.set("address", address || "");
  if (longitude && latitude) {
    endpoint.searchParams.set("longitude", longitude);
    endpoint.searchParams.set("latitude", latitude);
  }
  const searchResponse = await fetch(endpoint, {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": apiKey,
    },
  });

  if (!searchResponse.ok) {
    return renderError?.() || null;
  }

  const data = (await searchResponse.json()) as {
    query: { address: string };
    result: PlaceIndex[];
  };

  return renderData(data);
}
