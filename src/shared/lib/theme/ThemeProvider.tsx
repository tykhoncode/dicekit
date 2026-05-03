import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  ThemeProviderContext,
  type ResolvedTheme,
  type Theme,
  type ThemeProviderState,
} from "./context";

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "system";

const readStoredTheme = (storageKey: string, fallback: Theme): Theme => {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(storageKey);
  return isTheme(stored) ? stored : fallback;
};

const subscribeSystemTheme = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

const getSystemTheme = (): ResolvedTheme =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const getServerSystemTheme = (): ResolvedTheme => "light";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    readStoredTheme(storageKey, defaultTheme),
  );
  const systemTheme = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemTheme,
    getServerSystemTheme,
  );
  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const value = useMemo<ThemeProviderState>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (next: Theme) => {
        window.localStorage.setItem(storageKey, next);
        setThemeState(next);
      },
    }),
    [theme, resolvedTheme, storageKey],
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
