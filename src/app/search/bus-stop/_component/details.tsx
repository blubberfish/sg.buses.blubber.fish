import { type ReactNode, type PropsWithChildren } from "react";

export function GeneralDetails(
  props: PropsWithChildren<
    | {
        label: string;
        description?: ReactNode;
        skeleton?: boolean;
      }
    | { skeleton: true }
  >
) {
  const { children } = props;
  return (
    <div className="flex flex-col">
      <header className="flex flex-row items-center-safe p-3 gap-3">
        <h1 className="font-bold">
          {"skeleton" in props ? <>&nbsp;</> : props.label}
        </h1>
        {"skeleton" in props ? <>&nbsp;</> : props.description}
      </header>
      {children}
    </div>
  );
}

export function MoreDetails(
  props:
    | {
        peakAmFreq: string;
        peakPmFreq: string;
        offpeakAmFreq: string;
        offpeakPmFreq: string;
      }
    | { skeleton: true }
) {
  return (
    <div className="grid grid-cols-[max-content_1fr] auto-rows-min gap-y-1 gap-x-3 p-3 -mt-3 text-sm">
      <p className="text-gray-400">AM Peak Frequency</p>
      <p>
        {"skeleton" in props ? <>&nbsp;</> : <>{props.peakAmFreq} minutes</>}
      </p>
      <p className="text-gray-400">AM Off-peak Frequency</p>
      <p>
        {"skeleton" in props ? <>&nbsp;</> : <>{props.offpeakAmFreq} minutes</>}
      </p>
      <p className="text-gray-400">PM Peak Frequency</p>
      <p>
        {"skeleton" in props ? <>&nbsp;</> : <>{props.peakPmFreq} minutes</>}
      </p>
      <p className="text-gray-400">PM Off-peak Frequency</p>
      <p>
        {"skeleton" in props ? <>&nbsp;</> : <>{props.offpeakPmFreq} minutes</>}
      </p>
    </div>
  );
}
