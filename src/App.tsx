import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "@/layouts/root-layout";
import { AppLayout } from "@/layouts/app-layout";
import { LandingLayout } from "@/layouts/landing-layout";
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
import ProfilePage from "@/pages/profile";
import NotFoundPage from "@/pages/not-found";

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      errorElement: <NotFoundPage />,
      children: [
        // Public routes with the landing page layout
        {
          element: <LandingLayout />,
          children: [{ path: "/", element: <HomePage /> }],
        },
        // Standalone public routes
        { path: "/login", element: <LoginPage /> },
        { path: "/signup", element: <SignupPage /> },
        // Protected routes
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
                { path: "/profile", element: <ProfilePage /> },
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
