import { List } from "./_components";

function coerceToNumber(value?: string | string[] | null): number | undefined {
  const numStr = Array.isArray(value) ? value[0] : value;
  if (!numStr) {
    return undefined;
  }
  const num = parseFloat(numStr);
  return isNaN(num) ? undefined : num;
}

export default async function Page({ searchParams }: PageProps<"/explore">) {
  const {
    address,
    longitude: longitudeQuery,
    latitude: latitudeQuery,
  } = await searchParams;
  const longitude = coerceToNumber(longitudeQuery);
  const latitude = coerceToNumber(latitudeQuery);

  return (
    <>
      <section className="container mx-auto px-6">
        <h1 className="text-xl text-caption">Explore bus stops</h1>
        {!!address && <aside>{address}</aside>}
      </section>
      {longitude !== undefined && latitude !== undefined && (
        <List center={[longitude, latitude]} />
      )}
    </>
  );
}
