import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "@/layouts/root-layout";
import { AppLayout } from "@/layouts/app-layout";
import { ProtectedRoute } from "@/components/shared/protected-route";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import DashboardPage from "@/pages/dashboard";
import NotFoundPage from "@/pages/not-found";

// Placeholder pages for new nav links
import LibraryPage from "./pages/library";
const SrsPage = () => <div className="container p-8"><h1>SRS Review</h1></div>;

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // Public routes
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      
      // Protected routes wrapped in the main AppLayout
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

function App() {
  return <RouterProvider router={router} />;
}

export default App;
