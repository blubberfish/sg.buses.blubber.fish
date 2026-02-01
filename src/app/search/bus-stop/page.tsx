import { List } from "./_component/list";

function stringOrFirstString(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function tryParseFloat(value: string | undefined) {
  if (!value) {
    return null;
  }
  try {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;
  const [label, location] =
    stringOrFirstString(search["meta"])?.split("@") || [];
  const [longitude, latitude] =
    location
      ?.split(",")
      .map((segment) => tryParseFloat(segment.trim().substring(2))) || [];

  return (
    <>
      <section className="container mx-auto px-9 py-6">
        <h1 className="text-sm text-gray-400">
          Showing bus-stops around&nbsp;
          <span className="text-lg text-gray-200">{label}</span>
        </h1>
      </section>
      <section className="container mx-auto px-9 flex flex-col gap-3">
        {!!longitude && !!latitude && (
          <List
            center={[longitude, latitude]}
          />
        )}
      </section>
    </>
  );
}
