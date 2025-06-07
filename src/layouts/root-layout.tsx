import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export function RootLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="quill-ui-theme">
      <main className="min-h-screen bg-background font-sans antialiased">
        <Outlet />
        <Toaster />
      </main>
    </ThemeProvider>
  );
}
