package dev.guigas.languagelearning.language_learning.service;

import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;
import dev.guigas.languagelearning.language_learning.dto.TranslationResult;
import dev.guigas.languagelearning.language_learning.enums.Language;
import dev.guigas.languagelearning.language_learning.provider.TranslationProviderResult;
import dev.guigas.languagelearning.language_learning.provider.ligva.LigvaTranslationProvider;

@Service
public class TranslationService {

    private final LigvaTranslationProvider ligvaTranslationProvider;

    public TranslationService(LigvaTranslationProvider ligvaTranslationProvider) {
        this.ligvaTranslationProvider = ligvaTranslationProvider;
    }

    public TranslationResult translate(LearningInteraction learningInteraction) {
        TranslationProviderResult providerResult = ligvaTranslationProvider.translate(learningInteraction.getSelectedText(),
                Language.fromCode(learningInteraction.getNativeLanguage()).orElse(Language.AUTO),
                Language.fromCode(learningInteraction.getTargetLanguage()).orElse(Language.ENGLISH));
        return new TranslationResult(
            providerResult.originalText(),
            providerResult.translatedText(),
            providerResult.sourceLanguage(),
            providerResult.targetLanguage()
        );
    }
}

