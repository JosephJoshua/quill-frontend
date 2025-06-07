import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

export function RootLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="quill-ui-theme">
      <main className="min-h-screen bg-background font-sans antialiased">
        {/* We can add a Header/Navbar here later */}
        <Outlet />
      </main>
    </ThemeProvider>
  );
}
