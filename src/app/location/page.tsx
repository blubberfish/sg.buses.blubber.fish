import { MapPinned, Radius, Search, XIcon as X } from "lucide-react";
import { ClearButton, LinkToNearest, SearchButton } from "./_components";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { place } = await searchParams;
  const placeQuery = place
    ? typeof place === "string"
      ? place
      : place[0]
    : undefined;
  const locationServiceResponse =
    !!placeQuery &&
    (await fetch(
      `https://jn4dhjceva.execute-api.ap-southeast-1.amazonaws.com/prod/api/v1/sg/location?${new URLSearchParams(
        [
          ["address", placeQuery],
          ["latitude", "1.311"],
          ["longitude", "103.844"],
        ]
      ).toString()}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": process.env["BLUBBERFISH_API_KEY"] || "",
        },
      }
    ));
  const listOfPlace:
    | {
        query: { address: string };
        result: Array<{
          Place: {
            AddressNumber: string;
            Country: string;
            Geometry: unknown;
            Label: string;
            Municipality: string;
            Neighborhood: string;
            PostalCode: string;
            Region: string;
            Street: string;
            SubRegion: string;
            TimeZone: { Name: string; Offset: number };
          };
        }>;
      }
    | undefined =
    !!locationServiceResponse &&
    locationServiceResponse.ok &&
    (await locationServiceResponse.json());

  console.log(listOfPlace);

  return (
    <>
      <section className="sm:mt-9 mb-9">
        <div
          className="bg-gray-900 flex flex-row flex-nowrap focus-within:ring-2 focus-within:ring-violet-300 items-center max-w-lg mx-auto overflow-hidden rounded w-full"
          data-context-root
        >
          <label className="flex-1 flex flex-row flex-nowrap items-center">
            <div className="p-3">
              <MapPinned />
            </div>
            <input
              className="flex-1 -ml-3 p-3 outline-0"
              placeholder="Search for a location"
              type="text"
            />
          </label>
          <SearchButton
            className="relative flex flex-row flex-nowrap items-center hover:bg-white/13 -ml-3 border-l border-transparent hover:border-gray-600"
            type="button"
          >
            <div className="p-3 -ml-[1px]">
              <Search className="sm:size-4" />
            </div>
            <span className="hidden sm:block p-3 -ml-3">Search</span>
          </SearchButton>
        </div>
        {!!placeQuery && (
          <div className="flex flex-row justify-end max-w-lg mt-3 mx-auto w-full">
            <ClearButton className="px-3 py-1 -mt-1 text-sm text-red-400">
              <X className="align-middle inline-block size-4" />
              <span className="align-middle inline-block ml-1">Reset</span>
            </ClearButton>
          </div>
        )}
      </section>
      {!listOfPlace && (
        <section className="mb-9">
          <center>
            <LinkToNearest className="px-3 py-2 whitespace-nowrap bg-gray-900 rounded text-blue-300 hover:ring-2 hover:ring-blue-300 disabled:bg-transparent disabled:ring-0">
              <Radius className="align-middle inline-block" />
              <span className="align-middle inline-block ml-3">
                Show bus stops around me
              </span>
            </LinkToNearest>
          </center>
        </section>
      )}
    </>
  );
}
