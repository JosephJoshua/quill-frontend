import { apiClient } from './apiClient';
import { ContentSummary, Language, CefrLevel, PaginatedResponse } from '@/types/api';

interface GetAllContentParams {
  q?: string;
  language?: Language | '';
  difficultyLevel?: CefrLevel | '';
  page?: number;
  limit?: number;
}

export const contentService = {
  getRecommendations: (): Promise<ContentSummary[]> => {
    return apiClient.get<ContentSummary[]>('/content/recommendations');
  },

  getAll: (params: GetAllContentParams): Promise<PaginatedResponse<ContentSummary>> => {
    // Create a new URLSearchParams object, filtering out empty values
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([, value]) => value != null && value !== '')
      ) as Record<string, string>
    );
    return apiClient.get<PaginatedResponse<ContentSummary>>(`/content/all?${query.toString()}`);
  },
};
