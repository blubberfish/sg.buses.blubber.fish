"use client";

import { ChevronRight, Search } from "@deemlol/next-icons";
import {
  type PlaceInfo,
  searchPlaces,
} from "@/lib/server/actions/search-places";
import { useActionState } from "react";

export interface SearchAddressProps {
  onSelectAddress?: (details: PlaceInfo) => void;
}

export function SearchAddress({ onSelectAddress }: SearchAddressProps) {
  const [{ result }, action, pending] = useActionState(searchPlaces, {});
  return (
    <>
      {!!result && (
        <ul className="sticky bottom-20 max-h-64 mx-4 overflow-auto rounded bg-neutral-800 text-white grid grid-cols-[1fr_max-content] auto-rows-min">
          <li className="sticky top-0 col-span-full from-emerald-400 to-violet-600 bg-linear-to-br px-3 py-2">
            <h1></h1>
            <button></button>
          </li>
          {result.result.map((data) => {
            const {
              PlaceId,
              Place: { Country, Label, Street },
            } = data;
            return (
              <li
                className="col-span-full grid grid-cols-subgrid auto-rows-min gap-2 hover:bg-white/5"
                key={PlaceId}
              >
                <header className="pl-3 pt-2 text-sm">{Label}</header>
                <aside className="pl-3 pb-2 flex flex-row gap-1">
                  <span className="text-xs px-1 rounded from-emerald-500 to-violet-600 bg-linear-to-br border-l border-t border-bg-emerald-200 text-white">
                    {Street}
                  </span>
                  <span className="text-xs px-1 rounded from-emerald-500 to-violet-600 bg-linear-to-br border-l border-t border-bg-emerald-200 text-white">
                    {Country}
                  </span>
                </aside>
                <button
                  className="col-start-2 col-span-1 row-start-1 row-span-2 px-1 h-full w-full"
                  onClick={() => {
                    onSelectAddress?.(data);
                  }}
                >
                  <ChevronRight />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <form
        className="w-full grid grid-cols-[max-content_1fr_max-content] grid-rows-1 grid-flow-col items-center sticky bottom-0 bg-neutral-800 text-white"
        action={action}
      >
        <div className="px-3 py-2 text-emerald-400">
          <Search className="size-4" />
        </div>
        <input
          className="px-3 py-2 outline-0 focus:bg-white/5 disabled:opacity-50"
          placeholder="Search address"
          disabled={pending}
          type="text"
          required
          name="address"
        />
        <button
          className="px-3 py-2 disabled:opacity-50"
          disabled={pending}
          type="submit"
        >
          Search
        </button>
      </form>
    </>
  );
}
