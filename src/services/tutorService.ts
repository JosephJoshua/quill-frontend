import { apiClient } from "./apiClient";
import { TutorChatRequest, TutorChatResponse } from "@/types/api";

export const tutorService = {
  chat: (data: TutorChatRequest): Promise<TutorChatResponse> => {
    return apiClient.post<TutorChatResponse>("/tutor/chat", data);
  },
};
