package dev.guigas.languagelearning.language_learning.domain;

import java.time.LocalDateTime;
import java.util.UUID;

import dev.guigas.languagelearning.language_learning.enums.Language;

public class Translation {

    private final String originalText;
    private final String translatedText;
    private final Language targetLanguage;
    private final Language nativeLanguage;
    private final LocalDateTime createdAt;
    private final String provider;
    private final UUID id;

    public Translation(String originalText, String translatedText, Language targetLanguage, Language nativeLanguage) {
        this.originalText = originalText;
        this.translatedText = translatedText;
        this.targetLanguage = targetLanguage;
        this.nativeLanguage = nativeLanguage;
        this.createdAt = LocalDateTime.now();
        this.provider = "";
        this.id = UUID.randomUUID();
    }

    public String getOriginalText() {
        return originalText;
    }

    public String getTranslatedText() {
        return translatedText;
    }

    public Language getTargetLanguage() {
        return targetLanguage;
    }

    public Language getNativeLanguage() {
        return nativeLanguage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public UUID getId() {
        return id;
    }
}