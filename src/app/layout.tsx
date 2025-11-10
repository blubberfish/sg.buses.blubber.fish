import { BusInfoLoaders } from "@/lib/react/datamall";
import {
  App,
  ShowSideBarAction,
  SideBar,
  TopBar,
} from "@/lib/react/layout/app";
import type { Metadata } from "next";
import "./globals.css";

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
          <a className="block px-9 py-3 hover:text-blue-300" href="favorites">
            Favorites
          </a>
          <a className="block px-9 py-3 hover:text-blue-300" href="location">
            Browse stops
          </a>
        </SideBar>
      </App>
    </html>
  );
}
