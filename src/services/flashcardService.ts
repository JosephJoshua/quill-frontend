import { apiClient } from "./apiClient";
import {
  Flashcard,
  FlashcardReviewDto,
  CreateFlashcardDto,
  PaginatedResponse,
} from "@/types/api";

// The API docs state UpdateFlashcardDto is the same as CreateFlashcardDto
export type UpdateFlashcardDto = CreateFlashcardDto;

interface GetAllFlashcardsParams {
  q?: string;
  language?: string;
  page?: number;
  limit?: number;
}

export const flashcardService = {
  getAll: (
    params: GetAllFlashcardsParams
  ): Promise<PaginatedResponse<Flashcard>> => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value != null && value !== ""
        )
      ) as Record<string, string>
    );
    return apiClient.get<PaginatedResponse<Flashcard>>(
      `/flashcards?${query.toString()}`
    );
  },

  getReviewQueue: (): Promise<Flashcard[]> => {
    return apiClient.get<Flashcard[]>("/flashcards/review-queue");
  },

  submitReview: (
    data: FlashcardReviewDto
  ): Promise<{ message: string; nextDueDate: string }> => {
    return apiClient.post("/flashcards/review", data);
  },

  create: (data: CreateFlashcardDto): Promise<Flashcard> => {
    return apiClient.post<Flashcard>("/flashcards", data);
  },

  update: (id: string, data: UpdateFlashcardDto): Promise<Flashcard> => {
    return apiClient.patch<Flashcard>(`/flashcards/${id}`, data);
  },

  deleteById: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/flashcards/${id}`);
  },
};
