import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("rounded-xl border border-border bg-white/40 p-5 shadow-sm dark:bg-slate-900/40", className)} {...props} />;
}
