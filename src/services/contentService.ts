import { apiClient } from './apiClient';
import { ContentSummary } from '@/types/api';

export const contentService = {
  getRecommendations: (): Promise<ContentSummary[]> => {
    return apiClient.get<ContentSummary[]>('/content/recommendations');
  },
  // We will add get-all and get-by-id later
};
