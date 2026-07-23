package dev.guigas.languagelearning.language_learning.service;

import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.Translation;
import dev.guigas.languagelearning.language_learning.enums.Language;
import dev.guigas.languagelearning.language_learning.provider.TranslationProviderResult;
import dev.guigas.languagelearning.language_learning.provider.ligva.LigvaTranslationProvider;

@Service
public class TranslationService {

    private final LigvaTranslationProvider ligvaTranslationProvider;

    public TranslationService(LigvaTranslationProvider ligvaTranslationProvider) {
        this.ligvaTranslationProvider = ligvaTranslationProvider;
    }

    public Translation translate(String text, Language sourceLanguageCode, Language targetLanguageCode) {
        TranslationProviderResult providerResult = ligvaTranslationProvider.translate(text, sourceLanguageCode, targetLanguageCode);
        return new Translation(
            providerResult.originalText(),
            providerResult.translatedText(),
            providerResult.sourceLanguage(),
            providerResult.targetLanguage()
        );
    }
        

}

