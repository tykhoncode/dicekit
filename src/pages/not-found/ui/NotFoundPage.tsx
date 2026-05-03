import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="text-muted-foreground">That page doesn't exist.</p>
        <Link to="/" className="underline">
          Go home
        </Link>
      </div>
    </main>
  );
}
