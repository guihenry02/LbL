import type { Language } from "../../../domain/language";

export interface LearningInteractionResponse {
    translatedText?: string;
    originalText?: string;
    targetLanguage?: Language;
    nativeLanguage?: Language;
    createdAt?: string;
    id?: string;
    errorMessage?: string;
    readingSessionId?: string;
}