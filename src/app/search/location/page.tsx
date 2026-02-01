import { LocationLink } from "./_components/link";
import { List } from "./_components/list";
import { Meta } from "./_components/meta";

function coerceToString(value: string | string[] | undefined): string {
  if (!value) return "";
  if (Array.isArray(value)) return value[0] || "";
  return value;
}

function validateAsNumber(value: string): string | null {
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return value;
  }
  return null;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;
  return (
    <List
      address={coerceToString(search["address"])}
      longitude={validateAsNumber(coerceToString(search["longitude"]))}
      latitude={validateAsNumber(coerceToString(search["latitude"]))}
      renderData={({ result, query }) => {
        return (
          <>
            <section className="container mx-auto px-9 my-6">
              <h1 className="text-sm text-gray-400">
                Search results for&nbsp;
                <span className="text-lg text-gray-200">{query.address}</span>
              </h1>
            </section>
            <section className="container mx-auto px-9 my-6">
              {result.length > 0 &&
                result.map(({ PlaceId, Place }) => (
                  <div className="my-3 p-3 rounded bg-gray-800" key={PlaceId}>
                    <LocationLink
                      labelQuery={`${Place.AddressNumber} ${Place.Street}, ${[
                        Place.Region,
                        Place.SubRegion,
                      ]
                        .filter(Boolean)
                        .join(", ")} ${Place.PostalCode}`}
                      latitudeQuery={Place.Geometry.Point[1]}
                      longitudeQuery={Place.Geometry.Point[0]}
                    >
                      {Place.AddressNumber} {Place.Street}
                    </LocationLink>
                    <Meta
                      content={[Place.Neighborhood, Place.Municipality]
                        .filter(Boolean)
                        .join(", ")}
                    />
                    <Meta
                      content={[Place.Region, Place.SubRegion, Place.PostalCode]
                        .filter(Boolean)
                        .join(", ")}
                    />
                  </div>
                ))}
            </section>
          </>
        );
      }}
    />
  );
}
