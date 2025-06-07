import { apiClient } from './apiClient';
import { Language, AssessmentPrompt, AssessProficiencyDto, UserProficiencyAssessment, User } from '@/types/api';

// NOTE: The API docs do not specify a change password endpoint.
// We are assuming a standard endpoint and DTO for this functionality.
interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export const userService = {
  getAssessmentPrompt: (language: Language): Promise<AssessmentPrompt> => {
    return apiClient.get<AssessmentPrompt>(`/users/assessment-prompt?language=${language}`);
  },

  submitAssessment: (data: AssessProficiencyDto): Promise<UserProficiencyAssessment> => {
    return apiClient.post<UserProficiencyAssessment>('/users/assessment', data);
  },

  updateProfile: (data: { name: string }): Promise<User> => {
    return apiClient.put<User>('/users/me', data);
  },

  changePassword: (data: ChangePasswordDto): Promise<void> => {
    return apiClient.post<void>('/auth/change-password', data);
  },
};
