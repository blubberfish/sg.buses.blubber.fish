import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="from-primary to-accent bg-linear-to-b h-dvh flex-1 grid grid-cols-1 grid-rows-1 items-center justify-items-center">
      <SignIn />
    </div>
  );
}
