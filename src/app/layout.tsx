import { ClerkProvider, Show, SignInButton, UserAvatar } from "@clerk/nextjs";
import { BusDataProvider } from "@/components/bus-data";
import { SideBar } from "@/components/side-bar";
import { Menu } from "lucide-react";
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
      <body className="bg-surface text-body">
        <ClerkProvider
          appearance={{
            cssLayerName: "clerk",
          }}
        >
          <div className="min-h-screen flex flex-col">
            <BusDataProvider>
              <header className="">
                <div className="flex flex-row items-center-safe">
                  <SideBar>
                    <button className="p-3" type="button">
                      <Menu className="size-4" />
                    </button>
                  </SideBar>
                  <div className="flex-1"></div>
                </div>
                <div className="h-px -mt-px to-surface-b bg-linear-to-l" />
              </header>
              {children}
            </BusDataProvider>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
