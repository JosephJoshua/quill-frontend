import { useTranslation } from "react-i18next";

export function LandingFooter() {
  const { t } = useTranslation();
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="w-full flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          {t("landing.footer.copy")}
        </p>
      </div>
    </footer>
  );
}
