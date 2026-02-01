import { AppProvider } from "@/components/providers/app";
import { DatamallProvider } from "@/components/providers/datamall";
import { PageHeader } from "@/components/page/header";
import { PageMenuLink } from "@/components/page/menu/link";
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
      <body className="bg-gray-700 text-white">
        <AppProvider>
          <DatamallProvider>
            <PageHeader>
              <section className="flex flex-col py-3">
                <PageMenuLink href="/search/favorites">Favorites</PageMenuLink>
                <PageMenuLink href="/search/nearest">Around Me</PageMenuLink>
              </section>
            </PageHeader>
            {children}
          </DatamallProvider>
        </AppProvider>
      </body>
    </html>
  );
}
