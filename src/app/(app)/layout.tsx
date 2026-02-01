import { type PropsWithChildren, type ReactNode } from "react";
import { AppProvider } from "@/components/providers/app";
import { DatamallProvider } from "@/components/providers/datamall";
import { PageHeader } from "@/components/page/header";
import { PageMenuLink } from "@/components/page/menu/link";

export default function Layout({
  children,
  location,
}: PropsWithChildren<{ location: ReactNode }>) {
  return (
    <AppProvider>
      <DatamallProvider>
        <PageHeader>
          <section className="flex flex-col py-3">
            <PageMenuLink href="/search/favorites">Favorites</PageMenuLink>
            <PageMenuLink href="/search/nearest">Around Me</PageMenuLink>
          </section>
        </PageHeader>
        {location}
        {children}
      </DatamallProvider>
    </AppProvider>
  );
}
