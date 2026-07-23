package dev.guigas.languagelearning.language_learning.dto;

import java.util.UUID;

import dev.guigas.languagelearning.language_learning.enums.Language;

public record LearningInteractionRequest(String selectedText, Language targetLanguage, Language nativeLanguage, UUID readingSessionId) {
    public LearningInteractionRequest(String selectedText, Language targetLanguage, Language nativeLanguage) {
        this(selectedText, targetLanguage, nativeLanguage, null);
    }
}