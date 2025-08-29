import DataMallProvider from "@/lib/client/components/datamall-provider";
import LocationsLoader from "@/lib/client/components/locations-loader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DataMallProvider>
      <LocationsLoader />
      {children}
    </DataMallProvider>
  );
}
