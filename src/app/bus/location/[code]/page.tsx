import { DataMallProvider } from "@/lib/client/components/datamall/contexts/client";
import { Accessibility, PlusSquare } from "lucide-react";
import React from "react";
import { Info } from "./components";

async function load(code: string) {
  const url = new URL(
    "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival"
  );
  url.searchParams.set("BusStopCode", code);
  const response = await fetch(url.href, {
    method: "GET",
    headers: {
      AccountKey: process.env.DATAMALL_APIKEY || "",
      accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  const data = await (response.json() as Promise<DataMall.BusStopArrivalInfo>);
  data.Services.sort((a, b) => {
    if (a.ServiceNo.length !== b.ServiceNo.length) {
      return a.ServiceNo.length - b.ServiceNo.length;
    }
    return a.ServiceNo.localeCompare(b.ServiceNo);
  });
  return data;
}

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const { Services } = await load(code);

  return (
    <DataMallProvider>
      <section className="mx-3">
        <h1 className="text-xl my-3">Bus stop</h1>
        <Info locationCode={code} />
      </section>
      {!!Services &&
        Services.map(({ ServiceNo, NextBus, NextBus2, NextBus3 }) => (
          <section key={ServiceNo} className="mx-3 mt-6">
            <h1 className="text-xl my-3">{ServiceNo}</h1>
            {(
              [NextBus, NextBus2, NextBus3].filter(
                (item) => !!item && !!item.EstimatedArrival
              ) as DataMall.BusArrivalInfo[]
            ).map(({ EstimatedArrival, Load, Feature, Type }) => {
              const eta = new Date(EstimatedArrival);
              const diffMins = Math.round((eta.getTime() - Date.now()) / 60000);
              return (
                <div
                  className="bg-neutral-900 mt-3 rounded border border-b-4 border-neutral-700"
                  key={EstimatedArrival}
                >
                  <h2 className="m-3">{Math.max(diffMins, 0)}&nbsp;mins</h2>
                  <section className="m-3 flex flex-row flex-nowrap items-center">
                    <h3 className="text-xs font-bold">Seats</h3>
                    <span
                      className={`ml-3 text-sm ${
                        Load === "SEA" ? "text-violet-400" : "text-gray-500"
                      }`}
                    >
                      Available
                    </span>
                    <span
                      className={`ml-2 text-sm ${
                        Load === "SDA" ? "text-violet-400" : "text-gray-500"
                      }`}
                    >
                      Limited
                    </span>
                    <span
                      className={`ml-2 text-sm ${
                        Load === "LSD" ? "text-violet-400" : "text-gray-500"
                      }`}
                    >
                      None
                    </span>
                  </section>
                  <section className="m-3 flex flex-row flex-nowrap items-center">
                    <h3 className="text-xs font-bold">Wheelchair-accessible</h3>
                    <span
                      className={`ml-3 text-sm ${
                        Feature === "WAB" ? "text-violet-400" : "text-gray-500"
                      }`}
                    >
                      Yes
                    </span>
                    <span
                      className={`ml-2 text-sm ${
                        Feature !== "WAB" ? "text-violet-400" : "text-gray-500"
                      }`}
                    >
                      No
                    </span>
                  </section>
                  <section className="m-3 flex flex-row flex-nowrap items-center">
                    <h3 className="text-xs font-bold">Bus type</h3>
                    <span
                      className={`ml-3 text-sm ${
                        Type === "SD" ? "text-violet-400" : "text-gray-500"
                      }`}
                    >
                      Single-deck
                    </span>
                    <span
                      className={`ml-2 text-sm ${
                        Type === "DD" ? "text-violet-400" : "text-gray-500"
                      }`}
                    >
                      Double-deck
                    </span>
                  </section>
                </div>
              );
            })}
          </section>
        ))}
    </DataMallProvider>
  );
}
