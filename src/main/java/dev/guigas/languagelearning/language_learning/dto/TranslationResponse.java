package dev.guigas.languagelearning.language_learning.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import dev.guigas.languagelearning.language_learning.enums.Language;

/*    private final String originalText;
    private final String translatedText;
    private final Language targetLanguage;
    private final Language nativeLanguage;
    private final LocalDateTime createdAt;
    private final String provider;
    private final UUID id;
 */

public record TranslationResponse(String translatedText, String originalText, Language targetLanguage, Language nativeLanguage, 
    LocalDateTime createdAt, UUID id) {
    
}
