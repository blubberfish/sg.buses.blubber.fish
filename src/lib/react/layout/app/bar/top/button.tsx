"use client";
import { ButtonHTMLAttributes } from "react";

export function TopAction(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="p-3 -mr-3 rounded hover:bg-white/13"
      type="button"
      {...props}
    />
  );
}
