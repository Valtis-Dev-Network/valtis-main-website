import Link from "next/link";
import { clsx } from "clsx";

const blocks = [
  [0, 0],
  [4, 0],
  [0, 1],
  [1, 1],
  [3, 1],
  [4, 1],
  [1, 2],
  [2, 2],
  [3, 2],
  [2, 3]
];

export function ValtisMark({ size = "md", animated = false }: { size?: "sm" | "md" | "lg"; animated?: boolean }) {
  const block = size === "lg" ? 18 : size === "md" ? 10 : 7;
  const gap = size === "lg" ? 5 : 3;
  return (
    <div
      aria-hidden="true"
      className="relative"
      style={{ width: block * 5 + gap * 4, height: block * 4 + gap * 3 }}
    >
      {blocks.map(([x, y], index) => (
        <span
          key={`${x}-${y}`}
          className={clsx("absolute rounded-[2px] bg-gradient-to-br from-cyan to-primary shadow-[0_0_18px_rgba(56,130,246,.35)]", animated && "animate-[valtisIn_.7s_ease_both]")}
          style={{
            left: x * (block + gap),
            top: y * (block + gap),
            width: block,
            height: block,
            animationDelay: `${index * 55}ms`,
            filter: y > 1 ? "hue-rotate(18deg)" : undefined
          }}
        />
      ))}
    </div>
  );
}

export function ValtisLogo({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="focus-ring inline-flex items-center gap-3 rounded-md">
      <ValtisMark size={compact ? "sm" : "md"} />
      {!compact && <span className="text-sm font-bold tracking-[0.42em] text-white">VALTIS</span>}
    </Link>
  );
}
