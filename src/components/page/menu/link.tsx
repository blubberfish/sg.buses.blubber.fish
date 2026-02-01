import Link, { type LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";

export function PageMenuLink(
  props: AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps
) {
  return <Link className="px-9 py-3 -my-1 hover:bg-gray-500" {...props} />;
}
