"use client";

import { searchPlaces } from "@/lib/server/actions/search-places";
import { useActionState } from "react";
import { SubmitButton } from "./_components/submit-button";

export default function Page() {
  const [state, action, pending] = useActionState(searchPlaces, {});

  if (state.result) {
    return (
      <form className="flex-1 flex flex-col" action={action}>
        <input type="hidden" name="action" value="reset" />
        <h1 className="mx-6 mt-6 text-lg">Select the closest location</h1>
        {state.result.result.map((data) => {
          const {
            PlaceId,
            Place: {
              Label,
              Municipality,
              Street,
            },
          } = data;
          const search = new URLSearchParams([
            ["filterBy", btoa(JSON.stringify(data))],
          ]).toString();
          return (
            <section
              className="mx-6 mt-6 px-6 py-4 bg-neutral-900 border border-neutral-600 border-b-4 rounded"
              key={PlaceId}
            >
              <a className="text-base" href={`/locations?${search}`}>
                {Label}
              </a>
              <aside className="flex flex-row gap-2">
                <span className="text-xs text-gray-400 border border-current rounded px-1">
                  {Municipality}
                </span>
                <span className="text-xs text-gray-400 border border-current rounded px-1">
                  {Street}
                </span>
              </aside>
            </section>
          );
        })}
        <SubmitButton disabled={pending} label="Cancel" />
      </form>
    );
  }

  return (
    <form className="flex-1 flex flex-col" action={action}>
      <input type="hidden" name="action" value="submit" />
      <div className="flex-1">
        <label className="flex flex-col gap-4 m-4 border border-b-4 border-neutral-600 focus-within:border-neutral-400 rounded bg-black">
          <h1 className="px-6 pt-2 text-sm text-gray-400">Address</h1>
          <input
            className="w-full px-6 py-4 rounded-none outline-0 bg-neutral-900 focus:bg-white/15 text-white"
            name="address"
            placeholder="Eg. 123 Main St"
            type="text"
          />
        </label>
      </div>
      <SubmitButton disabled={pending} label="Submit" />
    </form>
  );
}
