package dev.guigas.languagelearning.language_learning.dto;

import dev.guigas.languagelearning.language_learning.enums.Language;

public record LearningInteractionResponse(String selectedText, Language language) {
}
