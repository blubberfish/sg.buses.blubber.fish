import {
  BusRoutesLoader,
  BusServicesLoader,
  BusStopsLoader,
  DataContext,
} from "@/lib/client/components/datamall";
import SplashScreen from "./_components/splash";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DataContext>
      <BusServicesLoader />
      <BusRoutesLoader />
      <BusStopsLoader />
      <SplashScreen>{children}</SplashScreen>
    </DataContext>
  );
}
