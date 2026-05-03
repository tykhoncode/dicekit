/// <reference types="vite/client" />

// Mirror project-specific VITE_* keys from src/shared/config/env.ts here
// for typed access via raw `import.meta.env`. Build-time flags
// (DEV / PROD / MODE / SSR / BASE_URL) are already typed by vite/client —
// do not redeclare them.
//
// Example:
//   interface ImportMetaEnv {
//     readonly VITE_API_URL?: string;
//   }

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
