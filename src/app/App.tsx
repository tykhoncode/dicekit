import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, useLocation } from "react-router-dom";
import { store } from "./store";
import { AppRouter } from "./router";
import { ThemeProvider } from "@/shared/lib/theme";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

function RouteResetBoundary({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <ErrorBoundary resetKeys={[location.pathname]}>{children}</ErrorBoundary>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <RouteResetBoundary>
            <AppRouter />
          </RouteResetBoundary>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}
