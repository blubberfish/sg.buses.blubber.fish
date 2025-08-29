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
      revalidate: 30 * 7 * 24 * 60 * 60,
    },
  });
}
