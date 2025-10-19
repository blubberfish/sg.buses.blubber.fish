import { useDataMall } from "@/lib/client/components/datamall/contexts/client";
import { Deck } from "../../deck";
import { DataStore } from "@/lib/client/datamall";
import { StarOff } from "lucide-react";
import { useEffect, useState } from "react";

export function Item({
  objectId,
  onClick,
}: {
  objectId: DataMall.BusStopInfo["BusStopCode"];
  onClick?: () => void;
}) {
  const client = useDataMall();
  const [loading, setLoading] = useState<
    ReturnType<(typeof client)["queryCatalog"]> | undefined
  >(
    client.queryCatalog<DataMall.BusStopInfo>(DataStore.Locations, {
      only: objectId,
    })
  );
  const [data, setData] = useState<DataMall.BusStopInfo>();
  useEffect(() => {
    if (!loading) return;
    let abort = false;
    loading
      .then((result) => {
        if (abort) return;
        setData(result.data[0] as DataMall.BusStopInfo);
      })
      .finally(() => {
        if (abort) return;
        setLoading(undefined);
      });
    return () => {
      abort = true;
    };
  }, [loading]);

  if (!data) return null;
  return (
    <li className="px-3 py-2">
      <a
        className="hover:underline text-violet-300 cursor-pointer"
        href={`/bus/location/${data.BusStopCode}`}
      >
        {data.Description}
      </a>
      <aside className="mt-1 text-xs text-gray-400">{data.RoadName}</aside>
      <button
        className="px-3 py-1 my-1 border border-gray-400 bg-white/13 rounded text-xs hover:ring-2 hover:ring-emerald-300"
        onClick={onClick}
        type="button"
      >
        <StarOff className="inline-block align-middle size-[1em]" />
        <span className="align-middle ml-1">Unstar</span>
      </button>
    </li>
  );
}
