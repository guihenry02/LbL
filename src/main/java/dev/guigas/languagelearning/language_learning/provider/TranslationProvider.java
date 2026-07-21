package dev.guigas.languagelearning.language_learning.provider;

import dev.guigas.languagelearning.language_learning.enums.Language;

public interface TranslationProvider {

    TranslationProviderResult translate(
        String text,
        Language source,
        Language target
    );

}