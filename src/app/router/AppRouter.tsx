import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";

function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen flex items-center justify-center"
    >
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
