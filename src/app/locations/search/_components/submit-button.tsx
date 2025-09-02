export function SubmitButton({
  label,
  disabled,
}: {
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      className="px-6 py-2 m-6 from-emerald-400 to-violet-600/34 hover:to-violet-600/50 bg-linear-to-br border-t border-l border-emerald-200/64 hover:border-emerald-200 rounded disabled:opactiy-50"
      disabled={disabled}
      type="submit"
    >
      {label}
    </button>
  );
}
