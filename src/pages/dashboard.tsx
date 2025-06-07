import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { contentService } from "@/services/contentService";
import { flashcardService } from "@/services/flashcardService";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

export default function DashboardPage() {
  const { t } = useTranslation();

  const { data: recommendations, isLoading: isLoadingRecs } = useQuery({
    queryKey: ["recommendations"],
    queryFn: contentService.getRecommendations,
  });

  const { data: reviewQueue, isLoading: isLoadingQueue } = useQuery({
    queryKey: ["reviewQueue"],
    queryFn: flashcardService.getReviewQueue,
  });

  const isLoading = isLoadingRecs || isLoadingQueue;

  if (isLoading) return <DashboardSkeleton />;

  const reviewCount = reviewQueue?.length ?? 0;
  const continueReadingItem = recommendations?.[0];

  return (
    <div className="container p-4 sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        {t("dashboard.title")}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.reviewQueue")}</CardTitle>
            <CardDescription>{t("dashboard.reviewQueueDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{reviewCount}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" disabled={reviewCount === 0}>
              <Link to="/srs/review">
                {t("dashboard.startReview")}{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        {continueReadingItem ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.continueReading")}</CardTitle>
              <CardDescription>
                {t("dashboard.continueReadingDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {continueReadingItem.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {continueReadingItem.author}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="secondary">
                <Link to={`/reader/${continueReadingItem.id}`}>
                  {t("dashboard.openBook")}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="flex flex-col justify-center items-center">
            <CardHeader>
              <CardTitle>{t("dashboard.startReading")}</CardTitle>
              <CardDescription className="text-center">
                {t("dashboard.startReadingDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/library">{t("dashboard.browseLibrary")}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.weeklyGoal")}</CardTitle>
            <CardDescription>{t("dashboard.weeklyGoalDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("dashboard.comingSoon")}</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          {t("dashboard.recommendations")}
        </h2>
        <div className="relative">
          <div className="flex w-full space-x-4 pb-4 overflow-x-auto">
            {recommendations?.map((item) => (
              <Link
                key={item.id}
                to={`/reader/${item.id}`}
                className="block flex-shrink-0 w-[250px]"
              >
                <Card className="h-full hover:border-primary transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Language: {item.language.toUpperCase()}</p>
                      <p>Level: {item.difficultyLevel || "N/A"}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
