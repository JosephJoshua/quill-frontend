import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpenText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <NavLink to="/dashboard" className="mr-6 flex items-center space-x-2">
            <BookOpenText className="h-6 w-6" />
            <span className="font-bold">{t('appName')}</span>
          </NavLink>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <NavLink to="/dashboard" className={({ isActive }) => cn("transition-colors hover:text-foreground/80", isActive ? "text-foreground" : "text-foreground/60")}>
              {t('nav.dashboard')}
            </NavLink>
            <NavLink to="/library" className={({ isActive }) => cn("transition-colors hover:text-foreground/80", isActive ? "text-foreground" : "text-foreground/60")}>
              {t('nav.library')}
            </NavLink>
            <NavLink to="/srs/review" className={({ isActive }) => cn("transition-colors hover:text-foreground/80", isActive ? "text-foreground" : "text-foreground/60")}>
              {t('nav.srs')}
            </NavLink>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
