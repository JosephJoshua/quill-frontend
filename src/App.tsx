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
import AssessmentPage from "@/pages/assessment";
import ReaderPage from "@/pages/reader";
import NotFoundPage from "@/pages/not-found";

const AppRouter = () => {
  const { t } = useTranslation();
  import SrsReviewPage from "./pages/srs-review";

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
            { path: "/onboarding/assessment", element: <AssessmentPage /> },
            {
              element: <AppLayout />,
              children: [
                { path: "/dashboard", element: <DashboardPage /> },
                { path: "/library", element: <LibraryPage /> },
                { path: "/srs/review", element: <SrsReviewPage /> },
                { path: "/reader/:id", element: <ReaderPage /> },
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
