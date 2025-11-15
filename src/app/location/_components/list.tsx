"use client";

import { useDatamall } from "@/lib/react/datamall";
import { InfiniteScroll } from "@/lib/react/infinite-scroll";
import { DatamallBusStopService } from "@/lib/service/datamall/client";
import { BusStopInfo } from "@/lib/service/datamall/types";
import { useEffect, useState } from "react";
import { ListItem, ListItemSkeleton } from "./list-item";

export function List() {
  const { getService } = useDatamall();
  const service = getService().find(DatamallBusStopService);

  const [loading, setLoading] = useState<
    undefined | ReturnType<(typeof service)["list"]>
  >();
  const [entities, setEntities] = useState<BusStopInfo[]>();
  const [disableLoad, setDisableLoad] = useState(false);

  useEffect(() => {
    if (!loading) return;
    let cancel = false;
    loading
      .then(async ({ next, data }) => {
        if (cancel) return;
        setDisableLoad(() => !next);
        setEntities((currentList) =>
          [currentList || [], data].flatMap((list) => list)
        );
      })
      .finally(() => {
        if (cancel) return;
        setLoading(() => undefined);
      });
    return () => {
      cancel = true;
    };
  }, [loading]);

  return (
    <InfiniteScroll
      className="h-[calc(100dvh-theme(spacing.16))] grid grid-cols-1 auto-rows-min overflow-auto isolate"
      disabled={!!loading || disableLoad}
      onScrolledToEnd={() => {
        setLoading(() => service.list(entities?.length));
      }}
    >
      <div className="h-6 sticky top-0 from-transparent to-gray-800 bg-linear-to-t"></div>
      <ul>
        {!!entities &&
          entities.map(({ BusStopCode, Description, RoadName }) => (
            <ListItem
              key={BusStopCode}
              href={`/location/${BusStopCode}`}
              title={Description}
              description={RoadName}
              tags={[BusStopCode]}
            />
          ))}
        {!!loading && (
          <>
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
          </>
        )}
      </ul>
      <div className="h-6 sticky bottom-0 from-transparent to-gray-800 bg-linear-to-b"></div>
    </InfiniteScroll>
  );
}
