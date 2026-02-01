import { PropsWithChildren } from "react";

export function SideBarContainer({ children }: PropsWithChildren) {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-gray-900 grid grid-cols-1 grid-rows-[min-content_1fr]">
      {children}
    </div>
  );
}
