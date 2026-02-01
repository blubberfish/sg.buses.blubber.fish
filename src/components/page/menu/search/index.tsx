import { Search } from "lucide-react";
import { GeolocationToggle } from "./toggle/geolocation";

export function SearchInput() {
  return (
    <form
      className="flex flex-col gap-3 px-9 py-3 focus-within:bg-white/13"
      encType="x-www-urlencoded"
      method="GET"
      action="/search/location"
    >
      <section className="flex flex-row items-center">
        <input
          className="flex-1 p-3 py-2 outline-0 border-b border-b-gray-500 focus:border-b-gray-300"
          type="text"
          name="address"
          placeholder="Search address"
          required
        />
        <button
          className="p-3 rounded hover:ring-1 hover:ring-blue-300"
          type="submit"
          title="Search location"
        >
          <Search className="size-4" />
        </button>
      </section>
      <GeolocationToggle />
    </form>
  );
}
