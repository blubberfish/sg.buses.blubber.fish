import { BusInfoLoaders } from "@/lib/react/datamall";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <BusInfoLoaders>
      {children}
    </BusInfoLoaders>
  );
}
