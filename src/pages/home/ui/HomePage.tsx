export function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome</h1>
        <p className="text-muted-foreground">
          Edit{" "}
          <code className="px-1 py-0.5 rounded bg-muted">
            src/pages/home/ui/HomePage.tsx
          </code>{" "}
          to get started.
        </p>
      </div>
    </main>
  );
}
