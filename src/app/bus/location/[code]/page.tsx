import { ServiceList } from "./components/services";
import { Info } from './components'
import { DataMallProvider } from "@/lib/client/components/datamall/contexts/client";

async function load(id: string) {
  const url = new URL(
    "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival"
  );
  url.searchParams.set("BusStopCode", id);
  const response = await fetch(url.href, {
    method: "GET",
    headers: {
      AccountKey: process.env.DATAMALL_APIKEY || "",
      accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  return response.json() as Promise<DataMall.BusStopArrivalInfo>;
}

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <DataMallProvider>
      <section className="mx-3">
        <h1 className="text-xl my-3">Bus stop</h1>
        <Info locationCode={code} />
      </section>
    </DataMallProvider>
  );
}
