import api from "@/contexts/datamall/api";
import Link from "next/link";
import { FavoriteButton } from "./_components/favorite-button";
import { StopDescription } from "./_components/stop-description";
import { StopLabel } from "./_components/stop-label";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await api.arrival(id);

  const { BusStopCode, Services } = data;
  const now = Date.now();
  return (
    <>
      <section className="container mx-auto px-9 my-6 flex flex-row items-center-safe">
        <div className="flex flex-col flex-1">
          <p className="text-lg">
            <StopLabel id={BusStopCode} />
          </p>
          <p className="text-sm text-gray-400">
            <StopDescription id={BusStopCode} />
          </p>
        </div>
        <FavoriteButton busStopId={BusStopCode} />
      </section>
      {Services.map(({ ServiceNo, NextBus, NextBus2, NextBus3 }) => (
        <section className="container mx-auto my-6 bg-gray-800" key={ServiceNo}>
          <h1 className="text-lg px-9 py-6 border-b border-b-gray-500">
            <Link href={`/bus/${ServiceNo}`} className="hover:underline">
              {ServiceNo}
            </Link>
          </h1>
          <div className="grid grid-cols-1 auto-row-min gap-3 py-6">
            {[NextBus, NextBus2, NextBus3]
              .filter(({ EstimatedArrival }) => !!EstimatedArrival)
              .map(({ DestinationCode, EstimatedArrival }) => {
                const delta = Math.round(
                  (Date.parse(EstimatedArrival) - now) / 1000 / 60
                );
                return (
                  <div
                    className="px-9 flex flex-row items-center-safe gap-3"
                    key={[DestinationCode, EstimatedArrival].join("-")}
                  >
                    <p className="px-2 text-sm font-light rounded bg-sky-600">
                      <StopLabel id={DestinationCode} />
                    </p>
                    <p className="font-mono text-sm">
                      {delta > 0 ? (
                        <>
                          in{" "}
                          <span className="text-base font-bold">{delta}</span>{" "}
                          minutes
                        </>
                      ) : delta < 0 ? (
                        <>{Math.abs(delta)} minutes ago</>
                      ) : (
                        <>Now</>
                      )}
                    </p>
                  </div>
                );
              })}
          </div>
        </section>
      ))}
    </>
  );
}
