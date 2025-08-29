import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SG @ BlubberFish",
  description: "Get bus information",
};

export default function RootLayout({
  appHeader,
  children,
}: Readonly<{
  appHeader: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-svh w-screen bg-neutral-900 text-white/80">
        <div className="w-full max-w-md min-h-svh mx-auto bg-neutral-800">
          {appHeader}
          {children}
        </div>
      </body>
    </html>
  );
}
