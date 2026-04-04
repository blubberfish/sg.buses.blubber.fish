import { BusDataProvider, LoadBusData } from "@/components/bus-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <BusDataProvider>
      <LoadBusData>
        <header className="container mx-auto p-6">
          <Link
            className="text-title hover:text-body flex flex-row items-center-safe"
            href="/"
          >
            <ArrowLeft className="size-5" />
            <span className="ml-2">Home</span>
          </Link>
        </header>
        {children}
      </LoadBusData>
    </BusDataProvider>
  );
}
