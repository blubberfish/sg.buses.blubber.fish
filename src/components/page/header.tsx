import { SearchInput } from "./menu/search";
import { PageMenu } from "./menu";
import { PropsWithChildren } from "react";

export function PageHeader({ children }: PropsWithChildren) {
  return (
    <header className="px-9 h-16 flex flex-row items-center-safe">
      <div className="flex-1"></div>
      <PageMenu>
        <SearchInput />
        {children}
      </PageMenu>
    </header>
  );
}
