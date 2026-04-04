import { Form, Input } from "@/components/form";
import { Heart, Search, Earth } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <header className="h-96 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold opacity-60">Buses @ SG</h1>
        <Form
          className="container mx-auto mt-6 px-6 w-md max-w-full"
          method="GET"
          action="/search"
        >
          <section className="bg-white rounded shadow w-full flex flex-row items-center-safe">
            <Input.Text
              className="outline-none flex-1 px-3 py-1"
              name="address"
              placeholder="Search address"
              required
            />
            <button className="cursor-pointer p-3" type="submit">
              <Search className="size-4" />
            </button>
          </section>
          <section className="mt-3">
            <Input.UserLocation label="Use my location" />
          </section>
        </Form>
      </header>
      <nav className="container mx-auto mt-6 px-6 max-w-md grid grid-cols-1 gap-6">
        <Link
          className="from-pink-100 to-pink-300 bg-linear-to-br text-pink-900 rounded shadow col-span-full md:col-span-1 px-6 py-4 flex flex-row items-center"
          href="/favorites"
        >
          <Heart className="size-7" />
          <span className="ml-2">Favourites</span>
        </Link>
      </nav>
    </>
  );
}
