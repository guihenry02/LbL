package dev.guigas.languagelearning.language_learning.dto;

import dev.guigas.languagelearning.language_learning.enums.Language;

public record TranslationResult(
    String originalText,
    String translatedText,
    Language sourceLanguage,
    Language targetLanguage
) {}
