import { ClerkProvider } from "@clerk/nextjs";
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
