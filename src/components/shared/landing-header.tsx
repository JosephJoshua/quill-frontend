import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpenText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";

export function LandingHeader() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex justify-between px-4 sm:px-6 lg:px-12 h-16 items-center">
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center space-x-2">
            <BookOpenText className="h-6 w-6" />
            <span className="font-bold">{t("appName")}</span>
          </NavLink>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center justify-end space-x-4">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button variant="ghost" asChild>
            <NavLink to="/login">{t("landing.nav.login")}</NavLink>
          </Button>
          <Button asChild>
            <NavLink to="/signup">{t("landing.hero.cta")}</NavLink>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-3" side="top">
            <SheetHeader className="flex flex-col gap-3">
              <div className="flex gap-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>

              <NavLink
                to="/login"
                className="flex w-full p-2 hover:bg-muted rounded-md"
              >
                {t("landing.nav.login")}
              </NavLink>
              <Button asChild className="w-full">
                <NavLink to="/signup">{t("landing.hero.cta")}</NavLink>
              </Button>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
