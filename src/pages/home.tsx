import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BrainCircuit, MessageSquareQuote, BookCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col px-6 sm:px-12">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="w-full grid lg:grid-cols-2 place-items-center gap-10">
          <div className="text-center lg:text-start space-y-6">
            <main className="text-5xl md:text-6xl font-bold">
              <h1>{t("landing.hero.headline")}</h1>
            </main>
            <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
              {t("landing.hero.subheadline")}
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-4">
              <Button className="w-full md:w-1/3" size="lg" asChild>
                <NavLink to="/signup">{t("landing.hero.cta")}</NavLink>
              </Button>
            </div>
          </div>
          <div className="w-full h-80 bg-muted rounded-lg hidden lg:block">
            {/* Placeholder for a hero image or animation */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 bg-secondary -mx-12 px-12">
        <div className="w-full space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            {t("landing.features.title")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="flex items-center gap-4">
                <BookCheck className="w-8 h-8 text-primary" />
                <CardTitle>{t("landing.features.f1_title")}</CardTitle>
              </CardHeader>
              <CardContent>{t("landing.features.f1_desc")}</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center gap-4">
                <BrainCircuit className="w-8 h-8 text-primary" />
                <CardTitle>{t("landing.features.f2_title")}</CardTitle>
              </CardHeader>
              <CardContent>{t("landing.features.f2_desc")}</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex items-center gap-4">
                <MessageSquareQuote className="w-8 h-8 text-primary" />
                <CardTitle>{t("landing.features.f3_title")}</CardTitle>
              </CardHeader>
              <CardContent>{t("landing.features.f3_desc")}</CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-24">
        <div className="w-full space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            {t("landing.testimonials.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <blockquote className="italic">
                  "{t("landing.testimonials.t1_text")}"
                </blockquote>
              </CardContent>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{t("landing.testimonials.t1_name")}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.testimonials.t1_role")}
                  </p>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <blockquote className="italic">
                  "{t("landing.testimonials.t2_text")}"
                </blockquote>
              </CardContent>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback>MG</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{t("landing.testimonials.t2_name")}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.testimonials.t2_role")}
                  </p>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-24 bg-secondary -mx-12 px-12">
        <div className="w-full text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("landing.final_cta.title")}
          </h2>
          <Button size="lg" asChild>
            <NavLink to="/signup">{t("landing.final_cta.cta")}</NavLink>
          </Button>
        </div>
      </section>
    </div>
  );
}
