import { useDataMall } from "@/lib/client/components/datamall/contexts/client";
import { Deck } from "../../deck";
import { DataStore } from "@/lib/client/datamall";
import { useEffect, useState } from "react";
import { StarButton } from "../../star-button";

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

  if (!data) return <Deck.Item></Deck.Item>;
  return (
    <Deck.Item>
      <header className="col-span-full grid grid-cols-subgrid">
        <a
          className="hover:underline text-violet-300 cursor-pointer"
          href={`/bus/location/${data.BusStopCode}`}
        >
          <h2>{data.Description}</h2>
        </a>
        {!!onClick && <StarButton active onClick={onClick} />}
      </header>
      <aside className="text-sm text-gray-400">{data.RoadName}</aside>
    </Deck.Item>
  );
}
