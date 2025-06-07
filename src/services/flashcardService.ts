import { apiClient } from './apiClient';
import { Flashcard } from '@/types/api';

export const flashcardService = {
  getReviewQueue: (): Promise<Flashcard[]> => {
    return apiClient.get<Flashcard[]>('/flashcards/review-queue');
  },
};
