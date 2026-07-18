package dev.guigas.languagelearning.language_learning.dto;

import dev.guigas.languagelearning.language_learning.domain.Language;

public record LearningInteractionResponse(String selectedText, Language language) {
}
