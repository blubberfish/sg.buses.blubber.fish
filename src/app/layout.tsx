import { BusInfoLoaders } from "@/lib/react/datamall";
import {
  App,
  ShowSideBarAction,
  SideBar,
  TopBar,
} from "@/lib/react/layout/app";
import { Bus, Heart } from "lucide-react";
import type { Metadata } from "next";
import "./globals.css";
import {
  GenericSideBarLink,
  LocationRadiusSideBarLink,
} from "./_components/side-bar-link";

export const metadata: Metadata = {
  title: "SG @ BlubberFish",
  description: "Get bus information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <App>
        <TopBar
          className={(css) =>
            [css, "flex flex-row flex-nowrap items-center"].join(" ")
          }
        >
          <div className="flex-1"></div>
          <ShowSideBarAction />
        </TopBar>
        <BusInfoLoaders>{children}</BusInfoLoaders>
        <SideBar>
          <GenericSideBarLink href="location">
            <Bus />
            <span className="ml-3">Bus stops</span>
          </GenericSideBarLink>
          <GenericSideBarLink href="favorites">
            <Heart />
            <span className="ml-3">Favorites</span>
          </GenericSideBarLink>
          <LocationRadiusSideBarLink />
        </SideBar>
      </App>
    </html>
  );
}
