"use client";

import { useDataMall } from "@/lib/client/components/datamall-provider";
import { Suspense, useEffect } from "react";

function List() {
  const client = useDataMall();
  useEffect(() => {
    client
      .queryCatalog(client.STORE_LOCATIONS, { limit: 10 })
      .then(({ nextKey, data }) => {
        console.log({ data });
        if (nextKey) {
          client
            .queryCatalog(client.STORE_LOCATIONS, {
              limit: 10,
              startFrom: nextKey,
            })
            .then((final) => {
              console.log({ final });
            });
        }
      });
    console.log();
  });
  return <div className="grid grid-cols-4"></div>;
}

export default function ListWrapper() {
  return (
    <Suspense>
      <List />
    </Suspense>
  );
}
