import { Search, X } from "@deemlol/next-icons";
import { Section } from "../section";
import { useActionState } from "react";
import { searchPlaces } from "@/lib/server/actions/search-places";
import { useRouter } from "next/navigation";

export function Seach() {
  const [state, action, pending] = useActionState(searchPlaces, {});
  const suggestions = state.result?.result;
  const router = useRouter();

  return (
    <Section title="Find bus stops">
      <form
        action={action}
        className="mt-3 bg-white/8 border border-white/13 focus-within:border-emerald-300 rounded overflow-hidden"
      >
        <input type="hidden" name="action" value="submit" />
        <label className="flex flex-row items-stretch">
          <div className="px-3 flex items-center bg-white/13">
            <Search className="size-5" />
          </div>
          <input
            className="px-3 py-1 outline-0 flex-1"
            name="address"
            placeholder="Search by address"
            required
            type="text"
          />
          <button
            className="px-3 py-1 bg-white/13 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={pending}
            type="submit"
          >
            <span>Search</span>
          </button>
        </label>
      </form>
      {suggestions && (
        <ul className="mt-6 grid grid-cols-1 gap-3">
          <li className="flex flex-row flexflex-nowrap items-center">
            <h2 className="flex-1">Choose an address</h2>
            <form action={action}>
              <input type="hidden" name="action" value="reset" />
              <button
                className="py-1 px-2 flex flex-row flex-nowrap items-center text-xs rounded-full bg-white/13 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={pending}
                type="submit"
              >
                <X className="size-4" />
                <span>Clear</span>
              </button>
            </form>
          </li>
          {suggestions.map((place) => {
            const {
              PlaceId,
              Place: { Label, Municipality },
            } = place;
            const url = new URL(document.location.href);
            url.searchParams.set("filterBy", "address");
            url.searchParams.set("address", btoa(JSON.stringify(place)));
            return (
              <li
                className="p-3 bg-neutral-900 border-b-2 border-b-gray-600"
                key={PlaceId}
              >
                <a
                  className="cursor-pointer text-emerald-300 hover:underline"
                  href={url.href}
                >
                  <h3>{Label}</h3>
                </a>
                <aside className="text-sm text-gray-400">{Municipality}</aside>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
