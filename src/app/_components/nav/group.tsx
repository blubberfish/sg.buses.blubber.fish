import React from "react";

export function NavGroup({ children }: React.PropsWithChildren) {
  return <nav className="flex flex-row flex-no-wrap border-b border-b-violet-300">{children}</nav>;
}
