import { StarButton } from "../star-button";

export function DeckItem({ children }: React.PropsWithChildren) {
  return (
    <li className="col-span-full grid grid-cols-subgrid px-3 py-6 bg-neutral-900 rounded border-b border-neutral-600">
      {children || (
        <>
          <div className="h-4 my-1 w-2/3 from-emerald-400 to-violet-400 bg-linear-to-br rounded animate-pulse"></div>
          <div className="h-3 my-1 w-2/3 bg-gray-400 rounded animate-pulse"></div>
          <StarButton />
        </>
      )}
    </li>
  );
}
