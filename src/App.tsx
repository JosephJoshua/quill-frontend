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
import SrsReviewPage from "@/pages/srs-review";
import SrsBrowsePage from "@/pages/srs-browse";
import QuizPage from "@/pages/quiz";
import QuizAttemptPage from "@/pages/quiz-attempt";
import NotFoundPage from "@/pages/not-found";

const AppRouter = () => {
  const { t } = useTranslation();

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
            { path: "/quiz/:contentId", element: <QuizPage /> },
            { path: "/quiz/attempt/:attemptId", element: <QuizAttemptPage /> },
            {
              element: <AppLayout />,
              children: [
                { path: "/dashboard", element: <DashboardPage /> },
                { path: "/library", element: <LibraryPage /> },
                { path: "/srs/review", element: <SrsReviewPage /> },
                { path: "/srs/all", element: <SrsBrowsePage /> },
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
