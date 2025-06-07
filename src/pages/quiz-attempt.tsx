import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { quizService } from "@/services/quizService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export default function QuizAttemptPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { t } = useTranslation();

  const { data: attempt, isError } = useQuery({
    queryKey: ["quizAttempt", attemptId],
    queryFn: () => quizService.getAttempt(attemptId!),
    refetchInterval: (data) =>
      data?.state.status === "success" ? false : 5000,
    enabled: !!attemptId,
  });

  if (isError)
    return (
      <div className="p-8 text-destructive">Failed to load quiz results.</div>
    );
  if (!attempt) return <div className="p-8">{t("common.loading")}</div>;

  if (attempt.status === "grading") {
    return (
      <div className="container max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("quiz.grading")}</h1>
        <p className="text-muted-foreground">{t("quiz.gradingDescription")}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8">{t("quiz.resultsTitle")}</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("quiz.score")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-center mb-4">
            {attempt.score}%
          </div>
          <Progress value={attempt.score} />
        </CardContent>
      </Card>
      <div className="space-y-4">
        {attempt.answers.map((ans, index) => (
          <div key={ans.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Question {index + 1}</p>
              {ans.isCorrect ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" /> {t("quiz.correct")}
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <XCircle className="h-4 w-4 mr-1" /> {t("quiz.incorrect")}
                </span>
              )}
            </div>
            <p className="mt-2 text-muted-foreground">
              {t("quiz.yourAnswer")}:{" "}
              <span className="text-foreground">{ans.userAnswer}</span>
            </p>
            {ans.feedback && (
              <p className="mt-2 text-sm text-blue-600">
                Feedback: {ans.feedback}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Button asChild>
          <Link to="/library">{t("quiz.backToLibrary")}</Link>
        </Button>
      </div>
    </div>
  );
}
