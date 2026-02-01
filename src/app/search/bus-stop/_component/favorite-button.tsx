"use client";

import { Heart } from "lucide-react";
import { useFavoriteBusStop } from "../_hooks/use-favorite-bus-stop";

export function FavoriteButton({ id = "" }: { id?: string }) {
  const { state, addToFavorite, removeFromFavorite } = useFavoriteBusStop(id);

  return (
    <button
      className="p-3 rounded hover:ring-1 hover:ring-blue-300"
      disabled={!id}
      type="button"
      title="Add to favorite"
      onClick={state ? removeFromFavorite : addToFavorite}
    >
      <Heart
        className={`size-4 ${
          state
            ? "fill-fuchsia-300 stroke-fuchsia-300"
            : "fill-none stroke-current"
        }`}
      />
    </button>
  );
}
