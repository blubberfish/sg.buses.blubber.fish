import { type ReactNode, type PropsWithChildren } from "react";

export function GeneralDetails({
  label,
  description,
  children,
}: PropsWithChildren<{
  label: string;
  description?: ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <header className="flex flex-row items-center-safe p-3 gap-3">
        <h1 className="font-bold">{label}</h1>
        {description}
      </header>
      {children}
    </div>
  );
}

export function MoreDetails({
  peakAmFreq,
  peakPmFreq,
  offpeakAmFreq,
  offpeakPmFreq,
}: {
  peakAmFreq: string;
  peakPmFreq: string;
  offpeakAmFreq: string;
  offpeakPmFreq: string;
}) {
  return (
    <div className="grid grid-cols-[max-content_1fr] auto-rows-min gap-y-1 gap-x-3 p-3 -mt-3 text-sm">
      <p className="text-gray-400">AM Peak Frequency</p>
      <p>{peakAmFreq} minutes</p>
      <p className="text-gray-400">AM Off-peak Frequency</p>
      <p>{offpeakAmFreq} minutes</p>
      <p className="text-gray-400">PM Peak Frequency</p>
      <p>{peakPmFreq} minutes</p>
      <p className="text-gray-400">PM Off-peak Frequency</p>
      <p>{offpeakPmFreq} minutes</p>
    </div>
  );
}
