import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  type?: "button" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function Button({ href, children, variant = "primary", className, type = "button", onClick }: ButtonProps) {
  const classes = clsx(
    "focus-ring group inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition",
    variant === "primary" && "bg-primary text-white shadow-glow hover:bg-blue-400",
    variant === "secondary" && "border border-white/12 bg-white/6 text-text hover:border-cyan/40 hover:bg-white/10",
    variant === "ghost" && "text-muted hover:bg-white/6 hover:text-text",
    variant === "danger" && "bg-danger text-white hover:bg-red-400",
    className
  );

  const content = (
    <>
      {children}
      {variant !== "ghost" && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {content}
    </button>
  );
}
