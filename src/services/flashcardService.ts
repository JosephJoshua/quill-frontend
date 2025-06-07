import { apiClient } from './apiClient';
import { Flashcard, FlashcardReviewDto } from '@/types/api';

export const flashcardService = {
  getReviewQueue: (): Promise<Flashcard[]> => {
    return apiClient.get<Flashcard[]>('/flashcards/review-queue');
  },

  submitReview: (data: FlashcardReviewDto): Promise<{ message: string; nextDueDate: string }> => {
    return apiClient.post('/flashcards/review', data);
  },
};
