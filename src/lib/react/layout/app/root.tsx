import { PropsWithChildren } from "react";

export function App({ children }: PropsWithChildren) {
  return (
    <body className="min-h-screen w-screen bg-gray-800 text-white/80 grid grid-cols-1 grid-rows-[min-content_1fr]">
      {children}
    </body>
  );
}
