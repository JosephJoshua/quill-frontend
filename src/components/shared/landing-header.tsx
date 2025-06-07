import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function LandingHeader() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <NavLink to="/" className="mr-6 flex items-center space-x-2">
            <BookOpenText className="h-6 w-6" />
            <span className="font-bold">{t('appName')}</span>
          </NavLink>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost" asChild><NavLink to="/login">{t('landing.nav.login')}</NavLink></Button>
          <ThemeToggle />
          <Button asChild><NavLink to="/signup">{t('landing.hero.cta')}</NavLink></Button>
        </div>
      </div>
    </header>
  );
}
