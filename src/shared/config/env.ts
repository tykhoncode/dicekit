import { z } from "zod";

// TODO(dicekit): add your project's VITE_* runtime envs here.
//
// Pattern when adding a key:
//   1. Add it to envSchema below (with .default() if optional, or
//      omit the default to require it at boot).
//   2. Mirror it in src/vite-env.d.ts (optional `?: string`) so raw
//      `import.meta.env.VITE_FOO` reads are typed.
//   3. Document it in .env.example.
//   4. Consume via `env.VITE_FOO` from this module — never via raw
//      `import.meta.env.VITE_FOO` (loosely typed, unvalidated).
//
// Build-time flags (DEV / PROD / MODE / SSR / BASE_URL) are typed by
// vite/client and statically replaced at build time. Read them via
// `import.meta.env.X` directly so dead-code-elimination strips dev-only
// branches in production bundles. Do not put them in this schema.

const envSchema = z.object({
  VITE_API_URL: z.string().min(1).default("/api"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(
    "[env] Invalid environment variables:",
    z.treeifyError(parsed.error),
  );
  throw new Error("Invalid environment variables. See console for details.");
}

export type Env = z.infer<typeof envSchema>;
export const env: Env = parsed.data;
