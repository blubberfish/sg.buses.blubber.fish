import { UserLocationInput } from "@/components/geo";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function Page({ searchParams }: PageProps<"/search">) {
  const { AWS_LOCATION_API_GATEWAY, BLUBBERFISH_API_KEY } = process.env;
  if (!AWS_LOCATION_API_GATEWAY || !BLUBBERFISH_API_KEY) {
    return <p>Configuration error: Missing API gateway URL or API key.</p>;
  }

  const {
    address: addressQuery,
    longitude: longitudeQuery,
    latitude: latitudeQuery,
  } = await searchParams;

  if (!addressQuery) {
    return (
      <form
        className="bg-surface px-6 py-4 max-w-sm"
        method="get"
        action="/search"
      >
        <section className="flex flex-col mb-3">
          <label
            className="text-sm text-title ml-3"
            htmlFor="search-input-address"
          >
            Search for a location
          </label>
          <input
            className="bg-black/3 focus:bg-sky-700/13 outline-0 px-3 py-1"
            id="search-input-address"
            name="address"
            required
            type="text"
            placeholder="Address"
          />
        </section>
        <section className="ml-3">
          <UserLocationInput />
        </section>
        <button className="mt-3" type="submit">
          Search
        </button>
      </form>
    );
  }

  const address = Array.isArray(addressQuery) ? addressQuery[0] : addressQuery;
  const longitude = Array.isArray(longitudeQuery)
    ? longitudeQuery[0]
    : longitudeQuery;
  const latitude = Array.isArray(latitudeQuery)
    ? latitudeQuery[0]
    : latitudeQuery;
  const endpoint = new URL("prod/api/v1/sg/location", AWS_LOCATION_API_GATEWAY);
  endpoint.searchParams.set("address", address || "");
  if (longitude && latitude) {
    endpoint.searchParams.set("longitude", longitude);
    endpoint.searchParams.set("latitude", latitude);
  }
  const searchResponse = await fetch(endpoint, {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": BLUBBERFISH_API_KEY,
    },
    next: {
      revalidate: 600, // 10 minutes
    },
  });
  const data =
    searchResponse.ok &&
    ((await searchResponse.json()) as {
      query: { address: string; bias: number[] };
      result: Array<{
        Distance: number;
        Place: {
          AddressNumber: string;
          Country: string;
          Geometry: {
            Point: number[];
          };
          Interpolated: boolean;
          Label: string;
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
      }>;
    });

  if (!data) {
    return null;
  }

  const { query, result } = data;

  return (
    <>
      <nav className="px-6 py-4">
        <Link
          className="text-title flex flex-row items-center-safe gap-1 px-3 py-1 -ml-3"
          href="/search"
        >
          <ArrowLeft className="size-5" />
          <span>Back</span>
        </Link>
      </nav>
      <header className="-mt-4 px-6 py-4">
        <h1 className="text-sm text-body">
          Showing results for
          <br />
          <span className="text-lg text-title">{query.address}</span>
        </h1>
      </header>
      <div className="flex flex-col gap-4 px-6 py-4 -mt-4">
        {result.length > 0 &&
          result.map(
            ({
              PlaceId,
              Place: {
                Label,
                Geometry: { Point },
              },
            }) => (
              <div key={PlaceId}>
                <Link
                  className="text-sm text-title flex flex-row items-center-safe gap-1"
                  href={`/search/bus?latitude=${Point[1]}&longitude=${Point[0]}`}
                >
                  <span className="underline">Explore</span>
                  <ExternalLink className="size-3" />
                </Link>
                <h2>{Label}</h2>
              </div>
            ),
          )}
      </div>
    </>
  );
}
