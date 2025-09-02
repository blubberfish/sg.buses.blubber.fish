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
            <Link path="/bus">Bus</Link>
          </NavGroup>
          {children}
        </div>
      </body>
    </html>
  );
}
