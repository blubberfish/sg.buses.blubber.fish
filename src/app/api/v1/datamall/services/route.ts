import service, { DatamallRestAPIService } from "@/lib/service/datamall/server";

function tryParse(s?: string | null) {
  if (!s) return 0;
  try {
    const n = parseInt(s, 10);
    if (isNaN(n)) {
      return 0;
    }
    return n;
  } catch {
    return 0;
  }
}

export async function GET(request: Request) {
  const skipParam = new URL(request.url).searchParams.get("$skip");
  return service
    .find(DatamallRestAPIService)
    .getBusServices({ skip: tryParse(skipParam) });
}
