"use client";

import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { ILoading } from "./types";
import { DatamallContext } from "@/contexts/datamall";

export function DatamallLoader({
  loading,
  children,
  fallback,
  onReady,
}: PropsWithChildren<{
  loading: ILoading;
  fallback?: React.ReactNode;
  onReady?: () => void;
}>) {
  const { db } = useContext(DatamallContext);
  const [pending, setPending] = useState<Promise<void>>();
  useEffect(() => {
    setPending(loading({ client: db() }));
  }, [db, loading]);
  useEffect(() => {
    if (!pending) {
      return;
    }
    let cancel = false;
    pending.finally(() => {
      if (cancel) return;
      setPending(() => undefined);
      onReady?.();
    });
    return () => {
      cancel = true;
    };
  }, [onReady, pending]);
  if (pending) {
    return fallback;
  }
  return children;
}
