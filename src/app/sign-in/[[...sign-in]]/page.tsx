import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="bg-neutral-100/13 backdrop-blur fixed inset-0 z-50 grid grid-cols-1 grid-rows-1">
      <SignIn />
    </div>
  );
}
