import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RootLayout } from "@/layouts/root-layout";
import { AppLayout } from "@/layouts/app-layout";
import { ProtectedRoute } from "@/components/shared/protected-route";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import DashboardPage from "@/pages/dashboard";
import LibraryPage from "@/pages/library";
import NotFoundPage from "@/pages/not-found";

// We define the router inside a component to use the i18n hook
const AppRouter = () => {
  const { t } = useTranslation();

  // Placeholder page for SRS
  const SrsPage = () => <div className="container p-8"><h1>{t('nav.srs')}</h1></div>;

  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      errorElement: <NotFoundPage />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/signup", element: <SignupPage /> },
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <AppLayout />,
              children: [
                { path: "/dashboard", element: <DashboardPage /> },
                { path: "/library", element: <LibraryPage /> },
                { path: "/srs/review", element: <SrsPage /> },
              ]
            }
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

function App() {
  return <AppRouter />;
}

export default App;
