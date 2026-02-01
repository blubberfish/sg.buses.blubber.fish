import { DatamallContext } from "@/contexts/datamall";
import { FavoritesStore } from "@/contexts/datamall/db";
import { useCallback, useContext, useEffect, useState } from "react";

const CATEGORY = "bus-stop";

export function useFavoriteBusStop(id: string) {
  const { db } = useContext(DatamallContext);
  const [pending, setPending] = useState<Promise<boolean>>();
  const [state, setState] = useState<boolean>();
  useEffect(() => {
    setPending(
      db()
        .using(FavoritesStore)
        .then((store) => store.exists(CATEGORY, id))
    );
  }, [db, id]);
  useEffect(() => {
    if (!pending) return;
    let cancel = false;
    pending
      .then((result) => {
        if (cancel) return;
        setState(result);
      })
      .finally(() => {
        if (cancel) return;
        setPending(() => undefined);
      });
    return () => {
      cancel = true;
    };
  }, [pending]);
  const addToFavorite = useCallback(() => {
    setPending((current) => {
      if (current) return current;
      return db()
        .using(FavoritesStore)
        .then(async (store) => {
          await store.append({
            category: CATEGORY,
            key: id,
          });
          return store.exists(CATEGORY, id);
        });
    });
  }, [db, id]);
  const removeFromFavorite = useCallback(() => {
    setPending((current) => {
      if (current) return current;
      return db()
        .using(FavoritesStore)
        .then(async (store) => {
          await store.drop({
            category: CATEGORY,
            key: id,
          });
          return store.exists(CATEGORY, id);
        });
    });
  }, [db, id]);

  return {
    state,
    addToFavorite,
    removeFromFavorite,
  };
}
