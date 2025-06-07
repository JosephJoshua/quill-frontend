import { apiClient } from "./apiClient";
import {
  ContentSummary,
  Language,
  CefrLevel,
  PaginatedResponse,
  ContentDetailResponse,
} from "@/types/api";

interface GetAllContentParams {
  q?: string;
  language?: Language | "";
  difficultyLevel?: CefrLevel | "";
  page?: number;
  limit?: number;
}

export const contentService = {
  getRecommendations: (): Promise<ContentSummary[]> => {
    return apiClient.get<ContentSummary[]>("/content/recommendations");
  },

  getAll: (
    params: GetAllContentParams
  ): Promise<PaginatedResponse<ContentSummary>> => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value != null && value !== ""
        )
      ) as Record<string, string>
    );
    return apiClient.get<PaginatedResponse<ContentSummary>>(
      `/content/all?${query.toString()}`
    );
  },

  getById: (id: string): Promise<ContentDetailResponse> => {
    return apiClient.get<ContentDetailResponse>(`/content/${id}`);
  },
};
