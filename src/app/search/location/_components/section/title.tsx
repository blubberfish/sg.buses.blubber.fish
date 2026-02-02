export function TitleSection({
  data,
  skeleton,
}: {
  data: string;
  skeleton?: boolean;
}) {
  return (
    <section className="container mx-auto px-9 my-6">
      {skeleton ? (
        <div className="text-lg w-full rounded bg-neutral-400 animate-pulse">
          &nbsp;
        </div>
      ) : (
        <h1 className="text-sm text-gray-400">
          Search results for&nbsp;
          <span className="text-lg text-gray-200">{data}</span>
        </h1>
      )}
    </section>
  );
}
