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
          <DatamallProvider
            fallback={
              <div className="h-dvh w-dvw flex flex-row items-center-safe justify-center-safe">
                <div className="size-6 rounded-full border-3 border-blue-300 border-t-gray-900 animate-spin" />
              </div>
            }
          >
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
