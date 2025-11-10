"use client";
import { ReactNode, useEffect, useState } from "react";

export function Await<T>({
  render,
  renderSkeleton,
  children,
}: {
  render: { (data: T): ReactNode };
  renderSkeleton?: { (): ReactNode };
  children?: Promise<T>;
}) {
  const [data, setData] = useState<{ ready: T } | undefined | null>();
  useEffect(() => {
    let cancel = false;
    setData(() => null);
    Promise.resolve(children).then((result) => {
      if (cancel) return;
      setData({ ready: result as T });
    });
    return () => {
      cancel = true;
    };
  }, [children]);

  if (!data) return renderSkeleton?.();
  return render(data.ready);
}
