import { Bus, Waypoints } from "lucide-react";
import type { Metadata } from "next";
import { Link, NavGroup } from "./_components/nav";
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
      <body className="min-h-svh w-screen bg-neutral-900 text-white/80">
        <div className="w-full max-w-md min-h-svh mx-auto bg-neutral-800">
          <header className="w-full h-16"></header>
          <NavGroup>
            <Link path="/bus/locations">
              <div className="flex flex-row flex-nowrap items-center px-2 py-1 hover:bg-white/10 rounded">
                <Bus className="size-4" />
                <span className="ml-2 font-bold">Bus stops</span>
              </div>
            </Link>
            <Link path="/bus/services">
              <div className="flex flex-row flex-nowrap items-center px-2 py-1 hover:bg-white/10 rounded">
                <Waypoints className="size-4" />
                <span className="ml-2 font-bold">Bus services</span>
              </div>
            </Link>
          </NavGroup>
          {children}
        </div>
      </body>
    </html>
  );
}
