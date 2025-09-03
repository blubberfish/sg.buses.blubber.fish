import { Star } from "@deemlol/next-icons";
import { distance } from "@turf/distance";
import { point } from "@turf/helpers";
import { Deck } from "../../deck";

export interface ItemsProps {
  active?: (id: DataMall.BusStopInfo["BusStopCode"]) => boolean;
  onToggleFavorite?: { (key: DataMall.BusStopInfo["BusStopCode"]): void };
  origin?: { latitude: number; longitude: number } | null;
  data: DataMall.BusStopInfo[];
}

export function Items({
  active,
  children,
  data,
  onToggleFavorite,
  origin,
}: React.PropsWithChildren<ItemsProps>) {
  return (
    <Deck>
      {data.map(
        ({ BusStopCode, Description, RoadName, Longitude, Latitude }) => (
          <Deck.Item key={BusStopCode}>
            <header className="col-span-full grid grid-cols-subgrid items-center">
              <h2>{Description}</h2>
              <button
                className={`flex flex-row flex-nowrap items-center px-2 py-1 bg-white/8 ${
                  active?.(BusStopCode)
                    ? "text-violet-400 border-violet-400"
                    : "border-white/13"
                } border rounded hover:border-emerald-300 hover:text-emerald-300`}
                onClick={() => {
                  onToggleFavorite?.(BusStopCode);
                }}
                type="button"
              >
                <Star className="size-3" />
                <span className="ml-2 text-sm">Star</span>
              </button>
            </header>
            <p className="text-xs text-gray-400">{RoadName}</p>
            {!!origin && (
              <p>
                {distance(
                  point([origin.longitude, origin.latitude]),
                  point([Longitude, Latitude]),
                  { units: "kilometers" }
                ).toFixed(2)}
                km
              </p>
            )}
          </Deck.Item>
        )
      )}
      {children}
    </Deck>
  );
}
