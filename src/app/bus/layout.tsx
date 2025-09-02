import { Link } from "./_components/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="flex flex-col justify-items-stretch content-stretch items-stretch">
        <Link label="Bus stops" path="/bus/locations" />
        <Link label="Bus services" path="/bus/services" />
      </nav>
      <div className="mt-6">
        {children}
      </div>
    </>
  );
}
