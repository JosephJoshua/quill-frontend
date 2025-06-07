import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { flashcardService } from "@/services/flashcardService";
import { Flashcard, FlashcardRating, JapaneseVocabDetails, ChineseVocabDetails, EnglishVocabDetails } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Helper component to display card details
const CardDetailsDisplay: React.FC<{ card: Flashcard }> = ({ card }) => {
  const { t } = useTranslation();
  const { details, language } = card;

  if (!details) return null;

  return (
    <div className="text-left w-full space-y-3 text-sm mt-4">
      <h4 className="font-semibold">{t('srs.details.title')}</h4>
      {details.partOfSpeech && <p><strong className="text-muted-foreground">{t('srs.details.pos')}:</strong> {details.partOfSpeech}</p>}
      {language === 'chi_sim' && (details as ChineseVocabDetails).pinyin && <p><strong className="text-muted-foreground">{t('srs.details.pinyin')}:</strong> {(details as ChineseVocabDetails).pinyin}</p>}
      {language === 'eng' && (details as EnglishVocabDetails).ipa && <p><strong className="text-muted-foreground">{t('srs.details.ipa')}:</strong> /{(details as EnglishVocabDetails).ipa}/</p>}
      
      {details.exampleSentences && details.exampleSentences.length > 0 && (
        <div>
          <strong className="text-muted-foreground">{t('srs.details.examples')}:</strong>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            {details.exampleSentences.map((ex, i) => <li key={i}>{ex.sentence}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function SrsReviewPage() {
  const { t } = useTranslation();
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueue = async () => {
      setIsLoading(true);
      try {
        const reviewQueue = await flashcardService.getReviewQueue();
        setQueue(reviewQueue);
      } catch (err) {
        setError(t('srs.loadingError'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchQueue();
  }, [t]);

  const handleReviewSubmit = async (rating: FlashcardRating) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await flashcardService.submitReview({ flashcardId: queue[currentIndex].id, rating });
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFrontText = (card: Flashcard) => {
    if (card.language === 'jpn' && (card.details as JapaneseVocabDetails)?.furigana) {
      const furigana = (card.details as JapaneseVocabDetails).furigana!;
      return <ruby className="text-4xl">{card.frontText}<rt>{furigana}</rt></ruby>;
    }
    return <p className="text-3xl md:text-4xl font-semibold">{card.frontText}</p>;
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen">{t('common.loading')}</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-destructive">{error}</div>;

  if (currentIndex >= queue.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center gap-4 p-4">
        <h1 className="text-4xl font-bold">{t('srs.allDoneTitle')}</h1>
        <p className="text-lg text-muted-foreground">{t('srs.allDoneDescription')}</p>
        <Button asChild><Link to="/dashboard">{t('srs.backToDashboard')}</Link></Button>
      </div>
    );
  }

  const currentCard = queue[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-secondary">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-4">{t('srs.title')}</h1>
        <Card className="min-h-[350px] flex flex-col">
          <CardContent className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            {!isFlipped ? (
              renderFrontText(currentCard)
            ) : (
              <>
                <p className="text-2xl md:text-3xl font-semibold">{currentCard.backText}</p>
                <Separator className="my-4" />
                <CardDetailsDisplay card={currentCard} />
              </>
            )}
          </CardContent>
          {isFlipped && (
            <CardFooter className="border-t p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                <Button variant="destructive" onClick={() => handleReviewSubmit(1)} disabled={isSubmitting}>{t('srs.ratings.again')}</Button>
                <Button variant="outline" onClick={() => handleReviewSubmit(2)} disabled={isSubmitting}>{t('srs.ratings.hard')}</Button>
                <Button variant="outline" onClick={() => handleReviewSubmit(3)} disabled={isSubmitting}>{t('srs.ratings.good')}</Button>
                <Button variant="default" onClick={() => handleReviewSubmit(4)} disabled={isSubmitting}>{t('srs.ratings.easy')}</Button>
              </div>
            </CardFooter>
          )}
        </Card>
        {!isFlipped && (
          <div className="flex justify-center mt-4">
            <Button size="lg" onClick={() => setIsFlipped(true)}>{t('srs.showAnswer')}</Button>
          </div>
        )}
        <div className="text-center mt-4 text-sm text-muted-foreground">
          {currentIndex + 1} / {queue.length}
        </div>
      </div>
    </div>
  );
}
