import { Deck } from "../deck";
import { useFavorites } from "./provider";
import { Item } from "./components";

export function Favorites() {
  const { data, loading, toggle } = useFavorites();
  return (
    <section className="mx-3">
      <h1 className="text-2xl font-bold">Favorite locations</h1>
      <Deck>
        {!!data && data.size <= 0 && <div></div>}
        {!!data &&
          data.size > 0 &&
          Array.from(data.values()).map(({ id }) => (
            <Item
              key={id}
              objectId={id}
              onClick={() => {
                toggle(id);
              }}
            ></Item>
          ))}
        {loading && !data && (
          <>
            <Deck.Item></Deck.Item>
            <Deck.Item></Deck.Item>
            <Deck.Item></Deck.Item>
          </>
        )}
      </Deck>
    </section>
  );
}
