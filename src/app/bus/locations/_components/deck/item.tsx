import { Star } from "@deemlol/next-icons";

export function DeckItem({ children }: React.PropsWithChildren) {
  return (
    <li className="col-span-full grid grid-cols-subgrid px-3 py-6 bg-neutral-900 rounded border-b border-neutral-600">
      {children || (
        <>
          <div className="h-4 my-1 w-2/3 from-emerald-400 to-violet-400 bg-linear-to-br rounded animate-pulse"></div>
          <div className="h-3 my-1 w-2/3 bg-gray-400 rounded animate-pulse"></div>
          <button className="col-start-2 col-span-1 row-start-1 row-span-1 flex flex-row flex-nowrap items-center gap-1 px-2 py-1 rounded bg-white/10 border border-white/15">
            <Star className="size-3" />
            <span className="text-sm">Star</span>
          </button>
        </>
      )}
    </li>
  );
}
