import type { Language } from "../../../domain/language";

// api/dto/LearningInteractionRequest.ts
export interface LearningInteractionRequest {
    selectedText: string;
    nativeLanguage: Language;
    targetLanguage: Language;
    readingSessionId?: string;
}