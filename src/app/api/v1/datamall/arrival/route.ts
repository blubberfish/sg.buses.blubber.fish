import service, { DatamallRestAPIService } from "@/lib/service/datamall/server";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    return Response.json({}, { status: 400 });
  }
  return service.find(DatamallRestAPIService).getBusArrival({ id: code || "" });
}
