"use client";

import { MapPin } from "@deemlol/next-icons";
import { DataMallProvider } from "@/lib/client/components/datamall/contexts/client";
import { DataContext } from "@/lib/client/components/datamall/contexts/data";
import BusRoutesLoader from "@/lib/client/components/datamall/bus-routes";
import BusServicesLoader from "@/lib/client/components/datamall/bus-services";
import BusStopsLoader from "@/lib/client/components/datamall/locations";
import { ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "./_components/splash";
import List from "./_components/list";
import { SearchAddress } from "./_components/search-address";
import { SearchBar } from "./_components/search";

export default function Page() {
  return (
    <DataMallProvider>
      <DataContext>
        <BusServicesLoader />
        <BusRoutesLoader />
        <BusStopsLoader />
        <SplashScreen>
          <div className="min-h-[calc(100svh-theme(spacing.16))]">
            <header className="sticky top-0 left-0 right-0 py-6 px-2 border-b border-b-black/67 bg-neutral-800/20 backdrop-blur">
              <h1>Filter</h1>
              <PrettyButton filter="nearest">
                <MapPin className="size-4" />
                <span className="pl-1 font-light overflow-hidden">Nearest</span>
              </PrettyButton>
              <SearchBar />
            </header>
            <List />
          </div>
          <SearchAddress />
        </SplashScreen>
      </DataContext>
    </DataMallProvider>
  );
}

function PrettyButton({
  filter,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { filter: string }) {
  const router = useRouter();
  return (
    <button
      className={`flex flex-row flexflex-nowrap items-center overflow-hidden rounded px-3 py-1 from-emerald-400/67 hover:from-emerald-400 to-violet-400/34 hover:to-violet-400/50 bg-linear-to-br text-white border-l border-t border-l-emerald-200 border-t-emerald-200`}
      type="button"
      onClick={() => {
        const url = new URL(document.location.href);
        url.searchParams.set("filterBy", filter);
        router.replace(url.href);
      }}
      {...props}
    />
  );
}
