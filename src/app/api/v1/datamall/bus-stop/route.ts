import api from "@/contexts/datamall/api";
import { type NextRequest } from "next/server";

function tryParseInt(s?: string | null) {
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

export const revalidate = 2592000;

export async function GET(request: NextRequest) {
  return Response.json(
    await api.stops(tryParseInt(request.nextUrl.searchParams.get("$skip")))
  );
}
