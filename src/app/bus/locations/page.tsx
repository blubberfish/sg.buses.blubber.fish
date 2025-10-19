"use client";

import React from "react";
import { Browser } from "./_components/browser";
import { Favorites } from "./_components/favorites";
import { FavoritesProvider } from "./_components/favorites/provider";
import { Seach } from "./_components/search";

export default function Page() {
  return (
    <FavoritesProvider>
      <div className="flex flex-col md:flex-row">
        <Favorites />
        <div className="flex-1 mt-9 md:mt-0">
          <Seach />
          <Browser />
        </div>
      </div>
    </FavoritesProvider>
  );
}
