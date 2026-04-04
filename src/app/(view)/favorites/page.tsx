import { List } from "./_components";

export default function Page() {
  return (
    <>
      <section className="container mx-auto px-6 mt-6">
        <h1 className="text-title text-xl">Favorite bus stops</h1>
      </section>
      <section>
        <List />
      </section>
    </>
  );
}
