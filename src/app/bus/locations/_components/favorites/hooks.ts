import { useDataMall } from "@/lib/client/components/datamall/contexts/client";
import { DataClient, DataStore } from "@/lib/client/datamall";
import { useCallback, useEffect, useState } from "react";

export interface FavoriteBusStop {
  id: string;
  tag: string[];
}

async function read(client: DataClient) {
  const { data } = await client.queryCatalog<FavoriteBusStop>(
    DataStore.Favorites,
    {}
  );
  return data;
}

async function write(client: DataClient, data: FavoriteBusStop) {
  await client.mutateCatalog(DataStore.Favorites, data);
  return data;
}

async function drop(client: DataClient, data: FavoriteBusStop["id"]) {
  await client.dropItem(DataStore.Favorites, data);
  return data;
}

export function useFavoritesState() {
  const client = useDataMall();
  const [data, setData] =
    useState<Map<FavoriteBusStop["id"], FavoriteBusStop>>();
  const [loading, setLoading] = useState<
    ReturnType<typeof read> | undefined | null
  >(read(client));

  const toggle = useCallback(
    (id: string) => {
      if (!data) return;
      if (!!loading) return;
      if (data.has(id)) {
        setLoading(drop(client, id).then(() => read(client)));
        return;
      }
      setLoading(write(client, { id, tag: [] }).then(() => read(client)));
    },
    [client, data, loading]
  );

  useEffect(() => {
    if (!loading) return;
    let abort = false;
    loading
      .then((result) => {
        if (abort) return;
        setData(new Map(result.map((item) => [item.id, item])));
      })
      .finally(() => {
        if (abort) return;
        setLoading(undefined);
      });
    return () => {
      abort = true;
    };
  }, [loading]);

  return {
    data,
    loading: !!loading,
    toggle,
  };
}
