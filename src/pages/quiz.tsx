import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { contentService } from "@/services/contentService";
import { quizService } from "@/services/quizService";
import { ContentDetailResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type AnswersState = { [questionId: string]: string };

export default function QuizPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [content, setContent] = useState<ContentDetailResponse | null>(null);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!contentId) return;
    contentService
      .getById(contentId)
      .then(setContent)
      .catch(() => toast.error("Failed to load quiz questions."))
      .finally(() => setIsLoading(false));
  }, [contentId]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentId || !content) return;
    setIsSubmitting(true);
    const submission = {
      contentId,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
    };
    try {
      const attempt = await quizService.submit(submission);
      navigate(`/quiz/attempt/${attempt.id}`);
    } catch (error) {
      toast.error("Failed to submit quiz.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8">{t("common.loading")}</div>;
  if (!content) return <div className="p-8">{t("common.error")}</div>;

  return (
    <div className="container max-w-3xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-2">{t("quiz.title")}</h1>
      <h2 className="text-xl text-muted-foreground mb-8">{content.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {content.comprehensionQuestions.map((q, index) => (
          <div key={q.id} className="p-6 border rounded-lg">
            <p className="font-semibold mb-4">
              {index + 1}. {q.question}
            </p>
            {q.questionType === "multipleChoice" ? (
              <RadioGroup
                onValueChange={(value) => handleAnswerChange(q.id, value)}
              >
                {q.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${q.id}-${i}`} />
                    <Label htmlFor={`${q.id}-${i}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Textarea
                placeholder="Your answer..."
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
            )}
          </div>
        ))}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("quiz.submitting") : t("quiz.submit")}
        </Button>
      </form>
    </div>
  );
}
