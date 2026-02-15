import { Suspense } from "react";
import { LocationLink } from "./_components/link";
import { List } from "./_components/list";
import { Card } from "./_components/card/container";
import { ResultsSection } from "./_components/section/results";
import { TitleSection } from "./_components/section/title";
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
    <Suspense
      fallback={
        <>
          <TitleSection data="" skeleton />
          <ResultsSection>
            {new Array(5).fill(0).map((_, index) => (
              <Card key={index} skeleton>
                <LocationLink
                  altLabel=""
                  labelQuery=""
                  longitudeQuery={0}
                  latitudeQuery={0}
                  skeleton
                />
                <Meta skeleton />
                <Meta skeleton />
              </Card>
            ))}
          </ResultsSection>
        </>
      }
    >
      <List
        address={coerceToString(search["address"])}
        longitude={validateAsNumber(coerceToString(search["longitude"]))}
        latitude={validateAsNumber(coerceToString(search["latitude"]))}
        renderData={({ result, query }) => {
          return (
            <>
              <TitleSection data={query.address} />
              <ResultsSection>
                {result.length > 0 &&
                  result.map(({ PlaceId, Place }) => (
                    <Card key={PlaceId}>
                      <LocationLink
                        altLabel={`${Place.AddressNumber} ${Place.Street}, ${[
                          Place.Region,
                          Place.SubRegion,
                        ]
                          .filter(Boolean)
                          .join(", ")} ${Place.PostalCode}`}
                        labelQuery={Place.Label}
                        latitudeQuery={Place.Geometry.Point[1]}
                        longitudeQuery={Place.Geometry.Point[0]}
                      >
                        {Place.Label}
                      </LocationLink>
                      <Meta
                        content={[Place.Neighborhood, Place.Municipality]
                          .filter(Boolean)
                          .join(", ")}
                      />
                      <Meta
                        content={[
                          Place.Region,
                          Place.SubRegion,
                          Place.PostalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      />
                    </Card>
                  ))}
              </ResultsSection>
            </>
          );
        }}
      />
    </Suspense>
  );
}
