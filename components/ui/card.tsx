import { clsx } from "clsx";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <article className={clsx("glass rounded-lg p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan/35 hover:shadow-cyan", className)}>
      {children}
    </article>
  );
}
