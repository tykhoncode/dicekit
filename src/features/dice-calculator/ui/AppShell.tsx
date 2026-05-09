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
    <div className="dark flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-6 px-6 py-6",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
