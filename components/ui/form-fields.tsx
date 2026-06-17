import { clsx } from "clsx";

export function Field({ label, name, children }: { label: string; name: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-200" htmlFor={name}>
      {label}
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx("focus-ring rounded-md border border-white/12 bg-white/6 px-3 py-2.5 text-sm text-text placeholder:text-muted", props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx("focus-ring min-h-32 rounded-md border border-white/12 bg-white/6 px-3 py-2.5 text-sm text-text placeholder:text-muted", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={clsx("focus-ring rounded-md border border-white/12 bg-surface px-3 py-2.5 text-sm text-text", props.className)} />;
}
