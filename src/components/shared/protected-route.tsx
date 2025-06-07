import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // While the store is rehydrating, isAuthenticated might be false initially.
  // A more robust solution might involve a loading state. For now, this is sufficient.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
