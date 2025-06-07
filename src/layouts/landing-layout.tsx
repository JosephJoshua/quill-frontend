import { Outlet } from "react-router-dom";
import { LandingHeader } from "@/components/shared/landing-header";
import { LandingFooter } from "@/components/shared/landing-footer";

export function LandingLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <LandingHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <LandingFooter />
    </div>
  );
}
