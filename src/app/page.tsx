import { List, Search } from "@deemlol/next-icons";

export default function Page() {
  return (
    <div className="">
      <a className="flex flex-row flex-nowrap items-center-safe" href="locations/near-me">
        <Search />
        <span className="text-nowrap">Quick search</span>
      </a>
      <a className="flex flex-row flex-nowrap items-center-safe" href="locations/browser">
        <List />
        <span className="text-nowrap">Browser</span>
      </a>
    </div>
  );
}
