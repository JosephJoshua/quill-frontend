# --- Step 3: Application Shell and Routing ---
echo "🚀 Step 3: Building the application shell, folder structure, and routing..."

# Clean up default Vite boilerplate
rm src/App.css src/assets/react.svg public/vite.svg

# Create the core application directory structure
mkdir -p src/components/shared src/components/ui
mkdir -p src/pages
mkdir -p src/layouts
mkdir -p src/store
mkdir -p src/services
mkdir -p src/types
mkdir -p src/hooks

# Create the Theme Provider component
cat <<'EOF' >src/components/theme-provider.tsx
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
EOF

# Create a Root Layout component
cat <<'EOF' >src/layouts/root-layout.tsx
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
EOF

# Create placeholder page components
cat <<'EOF' >src/pages/home.tsx
export default function HomePage() {
  return <div className="p-8"><h1>Quill Landing Page</h1></div>;
}
EOF

cat <<'EOF' >src/pages/login.tsx
export default function LoginPage() {
  return <div className="p-8"><h1>Login Page</h1></div>;
}
EOF

cat <<'EOF' >src/pages/signup.tsx
export default function SignupPage() {
  return <div className="p-8"><h1>Sign Up Page</h1></div>;
}
EOF

cat <<'EOF' >src/pages/dashboard.tsx
export default function DashboardPage() {
  return <div className="p-8"><h1>User Dashboard</h1></div>;
}
EOF

cat <<'EOF' >src/pages/not-found.tsx
export default function NotFoundPage() {
  return <div className="p-8"><h1>404 - Page Not Found</h1></div>;
}
EOF

# Overwrite App.tsx to be a clean entry point for the router
# In this setup, App.tsx is not strictly needed, but we'll keep it as the root router boundary
cat <<'EOF' >src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "@/layouts/root-layout";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import DashboardPage from "@/pages/dashboard";
import NotFoundPage from "@/pages/not-found";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
EOF

# Update main.tsx to render the App component
cat <<'EOF' >src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Commit the new application structure
git add .
git commit -m "feat: set up application structure, routing, and theme provider"

echo "✅ Step 3 complete: Application shell created and committed."
echo ""
