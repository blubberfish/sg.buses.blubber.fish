import { DashboardContainer } from "@/lib/components/dashboard/container";
import { DashboardHeader } from "@/lib/components/dashboard/header";
import { Loaders } from "@/lib/react/datamall";
import { Bus } from "lucide-react";
import type { Metadata } from "next";
import { SideBar } from "./_components/side-bar";
import { SideBarButton } from "./_components/side-bar/button";
import "./globals.css";
import Link from "next/link";

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
        {children}
      </body>
    </html>
  );
}
