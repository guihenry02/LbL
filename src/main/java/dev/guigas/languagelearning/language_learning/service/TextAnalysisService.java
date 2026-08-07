package dev.guigas.languagelearning.language_learning.service;

import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;
import dev.guigas.languagelearning.language_learning.domain.TextAnalysis;
import dev.guigas.languagelearning.language_learning.dto.TranslationResult;
import dev.guigas.languagelearning.language_learning.enums.AnalysisProvider;
import dev.guigas.languagelearning.language_learning.enums.InteractionType;
import dev.guigas.languagelearning.language_learning.enums.Language;

@Service
public class TextAnalysisService {

    private final TranslationService translationService;
    private final InteractionClassifier interactionClassifier;
    private final ExplanationService explanationService;

    public TextAnalysisService(
            TranslationService translationService,
            InteractionClassifier interactionClassifier,
            ExplanationService explanationService) {
        this.translationService = translationService;
        this.interactionClassifier = interactionClassifier;
        this.explanationService = explanationService;
    }

    public TextAnalysis analyze(LearningInteraction learningInteraction) {
        InteractionType interactionType = interactionClassifier.classify(learningInteraction);

        Language sourceLanguage = Language.fromCode(learningInteraction.getNativeLanguage()).orElse(Language.AUTO);
        Language targetLanguage = Language.fromCode(learningInteraction.getTargetLanguage()).orElse(Language.ENGLISH);

        TranslationResult translationResult = translationService.translate(
                learningInteraction);

        String explanation = null;
        if (learningInteraction.getSelectedText() != null && !learningInteraction.getSelectedText().isBlank()) {
            explanation = explanationService.explain(
                    translationResult.originalText(),
                    translationResult.translatedText());
        }

        return new TextAnalysis(
                interactionType,
                translationResult.translatedText(),
                explanation,
                AnalysisProvider.TRANSLATION_API,
                learningInteraction);
    }
}
