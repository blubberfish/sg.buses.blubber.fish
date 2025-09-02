import { DeckItem } from "./item";

export function Deck({ children }: React.PropsWithChildren) {
  return (
    <ul className="my-3 grid grid-cols-[1fr_max-content] auto-rows-min gap-y-3">
      {children}
    </ul>
  );
}

Deck.Item = DeckItem;
