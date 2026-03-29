import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex-1 grid grid-cols-1 grid-rows-1 items-center justify-items-center">
      <SignIn />
    </div>
  );
}
