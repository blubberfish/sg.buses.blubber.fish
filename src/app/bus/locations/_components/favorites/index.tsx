import { Deck } from "../deck";

export function Favorites() {
  return (
    <section className="mx-3">
      <h1 className="text-2xl font-bold">Favorite locations</h1>
      <Deck>
        <Deck.Item></Deck.Item>
        <Deck.Item></Deck.Item>
        <Deck.Item></Deck.Item>
      </Deck>
    </section>
  );
}
