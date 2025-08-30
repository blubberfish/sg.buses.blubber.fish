import BusServiceLoader from "@/lib/client/components/bus-services-loader";
import BusRoutesLoader from "@/lib/client/components/bus-routes-loader";
import DataMallProvider from "@/lib/client/components/datamall-provider";
import LocationsLoader from "@/lib/client/components/locations-loader";
import PageContext from "@/lib/client/components/page-context";
import SplashScreen from "./_components/splash";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DataMallProvider>
      <PageContext>
        <BusServiceLoader />
        <BusRoutesLoader />
        <LocationsLoader />
        <SplashScreen>{children}</SplashScreen>
      </PageContext>
    </DataMallProvider>
  );
}
