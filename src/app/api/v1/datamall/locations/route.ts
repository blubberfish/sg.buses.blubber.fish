const ONE_SECOND = 1;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

export async function GET(request: Request) {
  const skipParam = new URL(request.url).searchParams.get("$skip");
  const target = new URL(
    "https://datamall2.mytransport.sg/ltaodataservice/BusStops"
  );
  if (skipParam) {
    target.searchParams.set("$skip", skipParam);
  }
  return fetch(target, {
    method: "GET",
    headers: {
      AccountKey: process.env.DATAMALL_APIKEY || "",
      accept: "application/json",
    },
    next: {
      revalidate: 30 * ONE_DAY,
    },
  });
}
