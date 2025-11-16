import { MapPin } from "lucide-react";

export interface PlaceInfo {
  Distance: number;
  Place: {
    AddressNumber: string;
    Country: string;
    Geometry: {
      Point: number[];
    };
    Label: string;
    Municipality: string;
    Neighborhood: string;
    PostalCode: string;
    Region: string;
    Street: string;
    SubRegion: string;
    TimeZone: { Name: string; Offset: number };
  };
  PlaceId: string;
  Relevance: number;
}

export function SearchResult({ data }: { data: Array<PlaceInfo> }) {
  return (
    <ul className="flex flex-col">
      {data.map(({ PlaceId, Place: { Geometry, Label } }) => (
        <li
          className="flex flex-row items-center overflow-hidden first:rounded-t last:rounded-b bg-gray-900 px-9 py-6"
          key={PlaceId}
        >
          <MapPin />
          <a
            className="block ml-6 text-blue-300"
            href={`/location/${Geometry.Point.join("/")}?${new URLSearchParams([
              [
                "state",
                Buffer.from(
                  JSON.stringify({ type: "search", label: Label })
                ).toString("base64url"),
              ],
            ])}`}
          >
            <p>{Label}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
