export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100svh-theme(spacing.16))] flex flex-col">
      <header className="bg-black">
        <h1 className="text-lg font-bold px-6 py-4">Search for bus-stops</h1>
      </header>
      {children}
    </div>
  );
}
