import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { contentService } from "@/services/contentService";
import { flashcardService } from "@/services/flashcardService";
import { ContentSummary } from "@/types/api";

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<ContentSummary[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [recs, reviewQueue] = await Promise.all([
          contentService.getRecommendations(),
          flashcardService.getReviewQueue(),
        ]);
        setRecommendations(recs);
        setReviewCount(reviewQueue.length);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const continueReadingItem = recommendations.length > 0 ? recommendations[0] : null;

  if (isLoading) {
    return <div className="container p-8 text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container p-8 text-center text-destructive">{error}</div>;
  }

  return (
    <div className="container p-4 sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Review Queue</CardTitle>
            <CardDescription>Flashcards ready for review.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{reviewCount}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" disabled={reviewCount === 0}>
              <Link to="/srs/review">
                Start Review <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {continueReadingItem ? (
          <Card>
            <CardHeader>
              <CardTitle>Continue Reading</CardTitle>
              <CardDescription>Pick up where you left off.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{continueReadingItem.title}</p>
              <p className="text-sm text-muted-foreground">{continueReadingItem.author}</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="secondary">
                {/* This link will need to be updated when the reader page is built */}
                <Link to={`/reader/${continueReadingItem.id}`}>
                  Open Book <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
           <Card className="flex flex-col justify-center items-center">
             <CardHeader>
                <CardTitle>Start Reading</CardTitle>
                <CardDescription className="text-center">Explore the library to begin.</CardDescription>
             </CardHeader>
             <CardContent>
                <Button asChild>
                    <Link to="/library">Browse Library</Link>
                </Button>
             </CardContent>
           </Card>
        )}

        <Card>
           <CardHeader>
            <CardTitle>Weekly Goal</CardTitle>
            <CardDescription>Your progress this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Feature coming soon.</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Recommendations</h2>
        <div className="relative">
          <div className="flex w-full space-x-4 pb-4 overflow-x-auto">
            {recommendations.map((item) => (
              <Link key={item.id} to={`/reader/${item.id}`} className="block flex-shrink-0 w-[250px]">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Language: {item.language.toUpperCase()}</p>
                      <p>Level: {item.difficultyLevel || 'N/A'}</p>
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
