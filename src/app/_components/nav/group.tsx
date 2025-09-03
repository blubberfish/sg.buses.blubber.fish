import React from "react";

export function NavGroup({ children }: React.PropsWithChildren) {
  return <nav className="flex flex-row flex-no-wrap border-b border-b-neutral-300">{children}</nav>;
}
