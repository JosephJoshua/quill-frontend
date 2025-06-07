import { apiClient } from "./apiClient";
import { SubmitQuizDto, QuizAttempt } from "@/types/api";

export const quizService = {
  submit: (data: SubmitQuizDto): Promise<QuizAttempt> => {
    return apiClient.post<QuizAttempt>("/quizzes/submit", data);
  },

  getAttempt: (attemptId: string): Promise<QuizAttempt> => {
    return apiClient.get<QuizAttempt>(`/quizzes/attempts/${attemptId}`);
  },
};
