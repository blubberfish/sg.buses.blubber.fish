import Link from "next/link";
import { PropsWithChildren } from "react";

const BASE_PATH = "/search/bus-stop";

function formatQuery(params: Record<string, string | number>) {
  return new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  ).toString();
}

export function LocationLink({
  labelQuery,
  latitudeQuery,
  longitudeQuery,
  children,
}: PropsWithChildren<{
  labelQuery: string;
  longitudeQuery: number;
  latitudeQuery: number;
}>) {
  return (
    <Link
      className="text-lg hover:underline"
      href={`${BASE_PATH}?${formatQuery({
        meta: `${labelQuery}@ln${longitudeQuery},la${latitudeQuery}`,
      })}`}
    >
      {children}
    </Link>
  );
}
