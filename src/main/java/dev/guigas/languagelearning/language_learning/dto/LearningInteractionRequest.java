package dev.guigas.languagelearning.language_learning.dto;

import dev.guigas.languagelearning.language_learning.enums.Language;

public record LearningInteractionRequest(String selectedText, Language language) {
}