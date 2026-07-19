package dev.guigas.languagelearning.language_learning.dto;

import dev.guigas.languagelearning.language_learning.enums.InteractionType;

public record TextAnalysisResponse(InteractionType interactionType, String translatedText, String explanation) {
    public TextAnalysisResponse {
        if (interactionType == null) {
            throw new IllegalArgumentException("Interaction type cannot be null");
        }
        if (translatedText == null) {
            throw new IllegalArgumentException("Translated text cannot be null");
        }
        if (explanation == null) {
            throw new IllegalArgumentException("Explanation cannot be null");
        }
    }
}
