import { apiClient } from './apiClient';
import { Language, AssessmentPrompt, AssessProficiencyDto, UserProficiencyAssessment } from '@/types/api';

export const userService = {
  getAssessmentPrompt: (language: Language): Promise<AssessmentPrompt> => {
    return apiClient.get<AssessmentPrompt>(`/users/assessment-prompt?language=${language}`);
  },

  submitAssessment: (data: AssessProficiencyDto): Promise<UserProficiencyAssessment> => {
    return apiClient.post<UserProficiencyAssessment>('/users/assessment', data);
  },
};
