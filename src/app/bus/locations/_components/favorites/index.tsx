import { Deck } from "../deck";
import { useFavorites } from "./provider";

export function Favorites() {
  const { data, loading } = useFavorites();
  return (
    <section className="mx-3">
      <h1 className="text-2xl font-bold">Favorite locations</h1>
      <Deck>
        {!loading &&
          !!data &&
          Array.from(data.values()).map(({ id }) => <div key={id}>{id}</div>)}
        {loading && (
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
