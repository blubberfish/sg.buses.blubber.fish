"use client";

import { type PlaceInfo } from "@/lib/server/actions/search-places";
import { X } from "@deemlol/next-icons";
import { useFilterData } from "../hooks";

const RENDERER = {
  address: (
    { Place: { Label } }: PlaceInfo,
    onReset?: { (): void }
  ) => (
    <div className="my-3">
      <h2 className="text-sm font-light text-gray-400">Nearest to:</h2>
      <p className="text-violet-400">{Label}</p>
      <button
        className="mt-1 flex flex-row flex-nowrap items-center gap-1 px-2 rounded-full bg-white/8 border hover:bg-white/13 border-white/13 hover:border-white-21"
        onClick={onReset}
        type="button"
      >
        <X className="size-4" />
        <span className="text-sm mr-1">Reset</span>
      </button>
    </div>
  ),
} as {
  [key: string]: { (data: unknown, onReset?: { (): void }): React.ReactNode };
};

export function Filter() {
  const filtering = useFilterData();

  if (!filtering) return null;

  const {
    by,
    filter,
    actions: { reset },
  } = filtering;
  return RENDERER[by]?.(filter, reset) || null;
}
