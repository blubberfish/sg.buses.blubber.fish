"use client";

import { searchPlaces } from "@/lib/server/actions/search-places";
import { Search } from "@deemlol/next-icons";
import { useActionState } from "react";

export function SearchBar() {
  const [state, action] = useActionState(searchPlaces, {});
  console.log(state);
  return (
    <form action={action}>
      {state.error as string}
      <button type="button">
        <Search />
      </button>
      <input name="address" required type="text" />
      <button type="submit">Search</button>
    </form>
  );
}
