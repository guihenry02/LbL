package dev.guigas.languagelearning.language_learning.provider;

import dev.guigas.languagelearning.language_learning.enums.Language;

public record TranslationProviderResult(
    String originalText,
    String translatedText,
    Language sourceLanguage,
    Language targetLanguage
) {}