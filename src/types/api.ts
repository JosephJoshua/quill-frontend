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

// --- Flashcard Details ---
export interface BaseVocabDetails {
  partOfSpeech?: string;
  audioUrl?: string;
  exampleSentences?: { sentence: string; translation?: string }[];
}

export interface JapaneseVocabDetails extends BaseVocabDetails {
  furigana?: string;
}

export interface ChineseVocabDetails extends BaseVocabDetails {
  pinyin?: string;
}

export interface EnglishVocabDetails extends BaseVocabDetails {
  ipa?: string;
}

export type CardDetails =
  | JapaneseVocabDetails
  | ChineseVocabDetails
  | EnglishVocabDetails;

// --- Flashcards ---
export interface Flashcard {
  id: string;
  userId: string;
  language: Language;
  frontText: string;
  backText: string;
  details?: CardDetails;
  state: FlashcardState;
  dueDate: string;
}

export interface FlashcardReviewDto {
  flashcardId: string;
  rating: FlashcardRating;
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

export interface ContentDetailResponse {
  id: string;
  title: string;
  author?: string;
  language: Language;
  rawText: string;
  linguisticAnalysis: {
    keyVocabulary: {
      word: string;
      partOfSpeech: string;
      definition: string;
      exampleSentence: string;
    }[];
  };
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

// --- Tutor ---
export interface TutorChatRequest {
  message: string;
  contentId: string;
  conversationId?: string;
}

export interface TutorChatResponse {
  response: string;
  dialogueId: string;
  conversationId: string;
}

export interface Dialogue {
  id: string;
  userMessage: string;
  aiResponse: string;
  timestamp: string;
}

// --- API Error ---
export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}

// --- Flashcard Creation ---
export interface CreateFlashcardDto {
  contentId?: string;
  language: Language;
  frontText: string;
  backText: string;
  details?: CardDetails;
}

// --- Flashcard Creation ---
export interface CreateFlashcardDto {
  contentId?: string;
  language: Language;
  frontText: string;
  backText: string;
  details?: CardDetails;
}

// --- Quizzes ---
export interface SubmitQuizDto {
  contentId: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
}

export interface QuizAttempt {
  id: string;
  userId: string;
  contentId: string;
  status: 'grading' | 'completed';
  score?: number;
  createdAt: string;
  completedAt?: string;
  answers: {
    id: string;
    questionId: string;
    userAnswer: string;
    isCorrect?: boolean;
    feedback?: string;
  }[];
}
