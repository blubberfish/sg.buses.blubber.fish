import { MapPinned, Search } from "lucide-react";
import {
  PlaceInfo,
  SearchButton,
  SearchResult,
} from "./_components";

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
        result: Array<PlaceInfo>;
      }
    | undefined =
    !!locationServiceResponse &&
    locationServiceResponse.ok &&
    (await locationServiceResponse.json());

  return (
    <>
      <section
        className="mx-auto max-w-lg w-full overflow-hidden rounded flex flex-row flex-nowrap items-center bg-gray-900 text-neutral-100 focus-within:ring-2 focus-within:ring-blue-300"
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
          className="p-3 hover:bg-gray-700 border-l border-gray-600"
          type="button"
        >
          <Search className="sm:hidden" />
          <span className="hidden sm:block">Search</span>
        </SearchButton>
      </section>
      {!!listOfPlace && (
        <section className="mt-9 w-full max-w-2xl mx-auto">
          <header className="ml-9 mb-9 flex flex-row items-center">
            <h1 className="text-lg text-neutral-400">
              Displaying search results for <span className="font-bold text-neutral-100">{listOfPlace.query.address}</span>
            </h1>
          </header>
          <SearchResult data={listOfPlace.result} />
        </section>
      )}
    </>
  );
}
