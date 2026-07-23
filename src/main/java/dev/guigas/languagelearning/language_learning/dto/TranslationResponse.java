package dev.guigas.languagelearning.language_learning.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import dev.guigas.languagelearning.language_learning.enums.Language;


public record TranslationResponse(
    String translatedText, 
    String originalText, 
    Language targetLanguage, 
    Language nativeLanguage, 
    LocalDateTime createdAt, 
    UUID id, 
    String errorMessage,
    UUID readingSessionId
) {
    // Factory method para respostas com sucesso
    public static TranslationResponse success(
        String translatedText, 
        String originalText, 
        Language targetLanguage, 
        Language nativeLanguage, 
        LocalDateTime createdAt, 
        UUID id,
        UUID readingSessionId
    ) {
        return new TranslationResponse(translatedText, originalText, targetLanguage, nativeLanguage, createdAt, id, null, readingSessionId);
    }

    // Factory method para respostas com falha
    public static TranslationResponse error(String errorMessage) {
        return new TranslationResponse(null, null, null, null, LocalDateTime.now(), null, errorMessage, null);
    }
}