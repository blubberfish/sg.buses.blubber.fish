"use client";

import { Heart } from "lucide-react";
import { useFavoriteBusStop } from "../_hooks/use-favorite-bus-stop";

export function FavoriteButton({ busStopId }: { busStopId: string }) {
  const { state, addToFavorite, removeFromFavorite } =
    useFavoriteBusStop(busStopId);

  return (
    <button
      aria-label="favorite button"
      className="p-3 rounded hover:ring-1 hover:ring-blue-300"
      type="button"
      title="Add to favorites"
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
