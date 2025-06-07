import { NavLink } from "react-router-dom";
import { BookOpenText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <NavLink to="/dashboard" className="mr-6 flex items-center space-x-2">
            <BookOpenText className="h-6 w-6" />
            <span className="font-bold">Quill</span>
          </NavLink>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <NavLink to="/dashboard" className={({ isActive }) => cn("transition-colors hover:text-foreground/80", isActive ? "text-foreground" : "text-foreground/60")}>
              Dashboard
            </NavLink>
            <NavLink to="/library" className={({ isActive }) => cn("transition-colors hover:text-foreground/80", isActive ? "text-foreground" : "text-foreground/60")}>
              Library
            </NavLink>
            <NavLink to="/srs/review" className={({ isActive }) => cn("transition-colors hover:text-foreground/80", isActive ? "text-foreground" : "text-foreground/60")}>
              SRS
            </NavLink>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
