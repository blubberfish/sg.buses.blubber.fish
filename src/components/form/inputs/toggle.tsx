"use client";

import {
  InputHTMLAttributes,
  useContext,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from "react";
import { FormContext } from "../context";

export function Toggle({
  name,
  disabled,
  onChecked,
  onUnchecked,
}: {
  name: string;
  disabled?: boolean;
  onChecked?: () => void;
  onUnchecked?: () => void;
}) {
  const { data, set } = useContext(FormContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const checked = !!data[name];

  return (
    <button
      disabled={disabled}
      className={`${checked ? "bg-emerald-500" : "bg-gray-500"} rounded-full aspect-[2/1] h-4`}
      onClick={() => {
        inputRef.current?.click();
      }}
      type="button"
    >
      <div
        className={`bg-slate-300 rounded-full aspect-square h-full ${checked ? "translate-x-full" : "translate-x-0"} transition-transform`}
      />
      <input
        ref={inputRef}
        className="overflow-hidden size-0 opacity-0"
        type="checkbox"
        checked={!!data[name]}
        onChange={(event) => {
          const isChecked = event.target.checked;
          set(name, event.target.checked);
          if (isChecked) {
            onChecked?.();
          } else {
            onUnchecked?.();
          }
        }}
      />
    </button>
  );
}
