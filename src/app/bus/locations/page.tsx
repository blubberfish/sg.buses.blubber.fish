"use client";

import React from "react";
import { Browser } from "./_components/browser";
import { Favorites } from "./_components/favorites";
import { Seach } from "./_components/search";

export default function Page() {
  return (
    <>
      <Favorites />
      <Seach />
      <Browser />
    </>
  );
}
