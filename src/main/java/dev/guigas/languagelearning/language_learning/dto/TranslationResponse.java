package dev.guigas.languagelearning.language_learning.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import dev.guigas.languagelearning.language_learning.enums.Language;


public record TranslationResponse(String translatedText, String originalText, Language targetLanguage, Language nativeLanguage, 
    LocalDateTime createdAt, UUID id) {
    
}
