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
