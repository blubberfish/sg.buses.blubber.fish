import type { Metadata } from "next";
import { Link, NavGroup } from "./_components/nav";
import "./globals.css";
import { Truck } from "@deemlol/next-icons";

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
            <Link path="/bus">
              <div className="flex flex-row flex-nowrap items-center px-2 py-1 hover:bg-white/10 rounded">
                <Truck className="size-4" />
                <span className="ml-2 font-bold">Bus</span>
              </div>
            </Link>
          </NavGroup>
          {children}
        </div>
      </body>
    </html>
  );
}
