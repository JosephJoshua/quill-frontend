import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpenText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";
import { LanguageSwitcher } from "./language-switcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-0 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0">
                  {t('nav.srs')}
                  <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild><NavLink to="/srs/review" className="w-full">{t('nav.srsReview')}</NavLink></DropdownMenuItem>
                <DropdownMenuItem asChild><NavLink to="/srs/all" className="w-full">{t('nav.srsBrowse')}</NavLink></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
