import { ServiceList } from "./components/services";

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
    <div>
      <ServiceList locationCode={code} />
      Bus Location: {code}
    </div>
  );
}
