import { Star } from "@deemlol/next-icons";
import { Deck } from "../../deck";

export interface ItemsProps {
  data: DataMall.BusStopInfo[];
}

export function Items({ children, data }: React.PropsWithChildren<ItemsProps>) {
  return (
    <Deck>
      {data.map(({ BusStopCode, Description, RoadName }) => (
        <Deck.Item key={BusStopCode}>
          <header className="col-span-full grid grid-cols-subgrid items-center">
            <h2>{Description}</h2>
            <button
              className="flex flex-row flex-nowrap items-center px-2 py-1 bg-white/8 border border-white/13 rounded"
              type="button"
            >
              <Star className="size-3" />
              <span className="ml-2 text-sm">Star</span>
            </button>
          </header>
          <p className="text-xs text-gray-400">{RoadName}</p>
        </Deck.Item>
      ))}
      {children}
    </Deck>
  );
}
