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
      <body className="min-h-svh w-screen bg-neutral-300 text-black/80">
        <div className="w-full max-w-md min-h-svh mx-auto bg-neutral-200">
          <header className="h-16 from-emerald-200 to-violet-200 bg-linear-to-br"></header>
          {children}
        </div>
      </body>
    </html>
  );
}
