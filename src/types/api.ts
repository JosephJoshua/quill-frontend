// --- Enums ---
export type Language = "eng" | "jpn" | "chi_sim";
export type UserRole = "user" | "admin";
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type FlashcardState = 0 | 1 | 2 | 3; // New, Learning, Review, Relearning
export type FlashcardRating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

// --- Auth ---
export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  nativeLanguages: string[];
  targetLanguage: Language;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

// --- User ---
export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  estimatedCefrLevel?: CefrLevel;
  nativeLanguages: string[];
  targetLanguage: Language;
  createdAt: string;
  updatedAt: string;
}

// --- Content ---
export interface ContentSummary {
  id: string;
  title: string;
  author?: string;
  genre?: string;
  language: Language;
  difficultyLevel?: CefrLevel;
  createdAt: string;
}

// --- API Error ---
export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}

// --- Flashcards ---
export interface Flashcard {
  id: string;
  userId: string;
  language: Language;
  frontText: string;
  backText: string;
  state: FlashcardState;
  dueDate: string;
}

// --- Generic Paginated Response ---
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

// --- Assessment ---
export interface AssessmentPrompt {
  id: string;
  language: Language;
  promptText: string;
}

export interface AssessProficiencyDto {
  promptId: string;
  text: string;
}

export interface UserProficiencyAssessment {
  estimatedCefrLevel: CefrLevel;
  strengths: string[];
  areasForImprovement: {
    area: string;
    specifics: string;
  }[];
}
