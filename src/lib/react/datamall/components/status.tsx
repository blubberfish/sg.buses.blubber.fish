import { CheckCircle2 as Check } from "lucide-react";

export function Status({ loading }: { loading?: boolean }) {
  if (loading)
    return (
      <div className="size-3 border-2 border-violet-400 border-t-violet-100 rounded-full animate-spin" />
    );
  return <Check className="size-3 text-violet-300" />;
}
