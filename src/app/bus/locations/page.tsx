"use client";

import React from "react";
import { Browser } from "./_components/browser";
import { Favorites } from "./_components/favorites";
import { FavoritesProvider } from "./_components/favorites/provider";
import { Seach } from "./_components/search";

export default function Page() {
  return (
    <FavoritesProvider>
      <Favorites />
      <Seach />
      <Browser />
    </FavoritesProvider>
  );
}
