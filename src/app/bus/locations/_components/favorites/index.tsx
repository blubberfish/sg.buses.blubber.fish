import { useFavorites } from "./provider";
import { Item } from "./components";

export function Favorites() {
  const { data, toggle } = useFavorites();

  if (!data) return null;

  return (
    <section className="md:min-w-xs h-max grid grid-rows-[min-content_1fr] grid-cols-1">
      <h1 className="text-xl font-bold">Favorite locations</h1>
      <ul className="mt-6 overflow-auto rounded border border-neutral-600 bg-neutral-800">
        {Array.from(data.values()).map(({ id }) => (
          <Item
            key={id}
            objectId={id}
            onClick={() => {
              toggle(id);
            }}
          />
        ))}
      </ul>
    </section>
  );
}
