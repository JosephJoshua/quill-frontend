import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookOpenText } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-muted-foreground transition-colors hover:text-foreground",
      isActive && "text-foreground"
    );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-4 py-8">
        <NavLink
          to="/"
          className="mr-6 flex items-center space-x-2"
          onClick={() => setIsOpen(false)}
        >
          <BookOpenText className="h-6 w-6" />
          <span className="font-bold">{t("appName")}</span>
        </NavLink>
        <div className="flex flex-col space-y-3 pt-6">
          <NavLink
            to="/dashboard"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            {t("nav.dashboard")}
          </NavLink>
          <NavLink
            to="/library"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            {t("nav.library")}
          </NavLink>
          <NavLink
            to="/srs/review"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            {t("nav.srsReview")}
          </NavLink>
          <NavLink
            to="/srs/all"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            {t("nav.srsBrowse")}
          </NavLink>
        </div>
      </SheetContent>
    </Sheet>
  );
}
