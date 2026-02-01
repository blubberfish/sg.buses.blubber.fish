import { PropsWithChildren } from "react";

export function Table({ children }: PropsWithChildren) {
  return (
    <div className="overflow-hidden col-start-2 col-span-full grid-cols-1 grid-rows-1 gap-x-1">
      <div className="px-3 py-1 grid grid-cols-[1fr_max-content] auto-rows-min">
        {children}
      </div>
    </div>
  );
}

export function Row({ children }: PropsWithChildren) {
  return (
    <section className="col-span-full grid grid-cols-subgrid items-center">
      {children}
    </section>
  );
}
