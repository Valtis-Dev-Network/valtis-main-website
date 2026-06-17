import { clsx } from "clsx";

export function Badge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "cyan" | "green" | "amber" | "red" | "slate" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tone === "blue" && "border-primary/30 bg-primary/10 text-blue-200",
        tone === "cyan" && "border-cyan/30 bg-cyan/10 text-cyan",
        tone === "green" && "border-success/30 bg-success/10 text-emerald-200",
        tone === "amber" && "border-warning/30 bg-warning/10 text-amber-200",
        tone === "red" && "border-danger/30 bg-danger/10 text-red-200",
        tone === "slate" && "border-white/12 bg-white/6 text-muted"
      )}
    >
      {children}
    </span>
  );
}
