import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/auth";
import { userService } from "@/services/userService";
import { AssessmentPrompt } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AssessmentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [prompt, setPrompt] = useState<AssessmentPrompt | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.targetLanguage) {
      setError("Target language not found.");
      return;
    }
    const fetchPrompt = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const promptData = await userService.getAssessmentPrompt(
          user.targetLanguage
        );
        setPrompt(promptData);
      } catch (err) {
        setError(t("onboarding.errors.promptFailed"));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrompt();
  }, [user, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await userService.submitAssessment({
        promptId: prompt.id,
        text: responseText,
      });
      // In a real app, we might update the user profile in the store here
      navigate("/dashboard");
    } catch (err) {
      setError(t("onboarding.errors.submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const languageName = new Intl.DisplayNames([t("language")], {
    type: "language",
  }).of(user?.targetLanguage || "");

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{t("onboarding.title")}</CardTitle>
          <CardDescription>
            {t("onboarding.description", { language: languageName })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>{t("common.loading")}</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : prompt ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>{t("onboarding.promptLabel")}</Label>
                <div className="p-4 border rounded-md bg-muted text-muted-foreground">
                  {prompt.promptText}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="response">{t("onboarding.textLabel")}</Label>
                <Textarea
                  id="response"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response here..."
                  rows={10}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button type="button" variant="ghost" onClick={handleSkip}>
                  {t("onboarding.skipButton")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || responseText.length < 10}
                >
                  {isSubmitting
                    ? t("onboarding.submittingButton")
                    : t("onboarding.submitButton")}
                </Button>
              </div>
            </form>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
