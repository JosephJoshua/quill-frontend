import { Outlet } from "react-outer-dom";
import { Header } from "@/components/shared/header";

export function AppLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
