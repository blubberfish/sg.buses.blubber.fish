import { Building, BusFront } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function geocodeAPI({
  address,
  longitude,
  latitude,
}: {
  address: string;
  longitude?: string;
  latitude?: string;
}) {
  const { AWS_LOCATION_API_GATEWAY, BLUBBERFISH_API_KEY } = process.env;
  if (!AWS_LOCATION_API_GATEWAY || !BLUBBERFISH_API_KEY) {
    return null;
  }
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

  return data;
}

export default async function Page({ searchParams }: PageProps<"/search">) {
  const {
    address: addressQuery,
    userLongitude: userLongitudeQuery,
    userLatitude: userLatitudeQuery,
  } = await searchParams;
  const address = Array.isArray(addressQuery) ? addressQuery[0] : addressQuery;
  const userLongitude = Array.isArray(userLongitudeQuery)
    ? userLongitudeQuery[0]
    : userLongitudeQuery;
  const userLatitude = Array.isArray(userLatitudeQuery)
    ? userLatitudeQuery[0]
    : userLatitudeQuery;

  if (!address) {
    redirect("/");
  }

  const searchResults = await geocodeAPI({
    address,
    longitude: userLongitude,
    latitude: userLatitude,
  });

  if (!searchResults) {
    return <div>ERROR STATE</div>;
  }

  const { query, result } = searchResults;
  return (
    <>
      <section className="container mx-auto px-6">
        <aside className="text-caption text-sm">Search results for</aside>
        <h1 className="text-title text-xl">{query.address}</h1>
      </section>
      <section className="container mx-auto mt-6 px-6">
        {result.length === 0 && <div>No results found</div>}
        {result.length > 0 && (
          <ul className="flex flex-col gap-4 w-full">
            {result.map(
              ({
                PlaceId,
                Place: {
                  Label,
                  Geometry: {
                    Point: [longitude, latitude],
                  },
                },
              }) => (
                <li
                  key={PlaceId}
                  className="flex flex-row items-center-safe gap-3"
                >
                  <div className="from-sky-500 to-blue-700 bg-linear-to-br text-white p-2 rounded-full">
                    <Building className="size-4" />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <h2 className="text-lg w-full overflow-hidden text-ellipsis text-nowrap">
                      {Label}
                    </h2>
                    <Link
                      className="text-title text-sm rounded-full border w-max px-2 py-1 flex flex-row items-center gap-1"
                      href={`/explore?${new URLSearchParams({ address: Label, longitude: longitude.toString(), latitude: latitude.toString() }).toString()}`}
                    >
                      <BusFront className="size-4" />
                      <span>Bus stops</span>
                    </Link>
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </section>
    </>
  );
}
