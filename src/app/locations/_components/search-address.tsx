"use client";

import { searchPlaces } from "@/lib/server/actions/search-places";
import { useActionState } from "react";

export function SearchAddress() {
  const [{ result }, action] = useActionState(searchPlaces, {});
  return (
    <>
      {!!result && (
        <ul className="sticky bottom-20 max-h-64 mx-4 overflow-auto rounded bg-white text-black">
          <li>RESULTS</li>
          <li>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </li>
        </ul>
      )}
      <form
        className="h-16 w-full sticky bottom-0 bg-white text-black"
        action={action}
      >
        <input type="text" required name="address" />
        <button type="submit">Search</button>
      </form>
    </>
  );
}
