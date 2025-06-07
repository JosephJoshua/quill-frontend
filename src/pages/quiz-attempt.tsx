import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { quizService } from "@/services/quizService";
import { QuizAttempt } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export default function QuizAttemptPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { t } = useTranslation();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    let intervalId: number;
    const fetchAttempt = async () => {
      try {
        const data = await quizService.getAttempt(attemptId);
        setAttempt(data);
        if (data.status === 'completed' && intervalId) {
          clearInterval(intervalId);
        }
      } catch (err) {
        setError("Failed to load quiz results.");
        clearInterval(intervalId);
      }
    };

    fetchAttempt();
    intervalId = setInterval(fetchAttempt, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [attemptId]);

  if (error) return <div className="p-8 text-destructive">{error}</div>;
  if (!attempt) return <div className="p-8">{t('common.loading')}</div>;

  if (attempt.status === 'grading') {
    return (
      <div className="container max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('quiz.grading')}</h1>
        <p className="text-muted-foreground">{t('quiz.gradingDescription')}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8">{t('quiz.resultsTitle')}</h1>
      <Card className="mb-8">
        <CardHeader><CardTitle>{t('quiz.score')}</CardTitle></CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-center mb-4">{attempt.score}%</div>
          <Progress value={attempt.score} />
        </CardContent>
      </Card>
      <div className="space-y-4">
        {attempt.answers.map((ans) => (
          <div key={ans.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Question {attempt.answers.indexOf(ans) + 1}</p>
              {ans.isCorrect ? (
                <span className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1" /> {t('quiz.correct')}</span>
              ) : (
                <span className="flex items-center text-red-600"><XCircle className="h-4 w-4 mr-1" /> {t('quiz.incorrect')}</span>
              )}
            </div>
            <p className="mt-2 text-muted-foreground">{t('quiz.yourAnswer')}: <span className="text-foreground">{ans.userAnswer}</span></p>
            {ans.feedback && <p className="mt-2 text-sm text-blue-600">Feedback: {ans.feedback}</p>}
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Button asChild><Link to="/library">{t('quiz.backToLibrary')}</Link></Button>
      </div>
    </div>
  );
}
