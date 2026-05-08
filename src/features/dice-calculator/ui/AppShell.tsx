import type { ReactNode } from "react";
import { cn } from "@/shared/lib/classnames";

export function AppShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground">
      <div className={cn("flex flex-1 flex-col gap-6 px-6 py-6", className)}>
        {children}
      </div>
    </div>
  );
}
