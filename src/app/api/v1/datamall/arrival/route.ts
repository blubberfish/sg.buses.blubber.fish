import { SERVER_CACHE_ONE_MINUTE } from '@/lib/constants'

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  const target = new URL(
    "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival"
  );
  if (code) {
    target.searchParams.set("BusStopCode", code);
  }
  return fetch(target, {
    method: "GET",
    headers: {
      AccountKey: process.env.DATAMALL_APIKEY || "",
      accept: "application/json",
    },
    next: {
      revalidate: SERVER_CACHE_ONE_MINUTE,
    },
  });
}
