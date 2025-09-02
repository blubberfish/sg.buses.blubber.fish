import { DataMallProvider } from "@/lib/client/components/datamall/contexts/client";
import { DataContext } from "@/lib/client/components/datamall/contexts/data";
import BusRoutesLoader from "@/lib/client/components/datamall/bus-routes";
import BusServicesLoader from "@/lib/client/components/datamall/bus-services";
import BusStopsLoader from "@/lib/client/components/datamall/locations";
import SplashScreen from "./_components/splash";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DataMallProvider>
      <DataContext>
        <BusServicesLoader />
        <BusRoutesLoader />
        <BusStopsLoader />
        <SplashScreen>{children}</SplashScreen>
      </DataContext>
    </DataMallProvider>
  );
}
