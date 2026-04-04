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
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
