import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";

export function GenericSideBarLink(
  props: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
) {
  return (
    <Link
      className="flex flex-row flex-nowrap items-center px-9 py-3 hover:text-blue-300"
      {...props}
    />
  );
}
