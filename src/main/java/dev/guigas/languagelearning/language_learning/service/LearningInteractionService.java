package dev.guigas.languagelearning.language_learning.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;
import dev.guigas.languagelearning.language_learning.domain.Translation;
import dev.guigas.languagelearning.language_learning.dto.LearningInteractionRequest;
import dev.guigas.languagelearning.language_learning.dto.LearningInteractionResponse;
import dev.guigas.languagelearning.language_learning.dto.TranslationResponse;
import dev.guigas.languagelearning.language_learning.enums.Language;
import dev.guigas.languagelearning.language_learning.repository.LearningInteractionRepository;

@Service
public class LearningInteractionService {

    private final LearningInteractionRepository learningInteractionRepository;
    private final TranslationService translationService;

    public LearningInteractionService(LearningInteractionRepository learningInteractionRepository, TranslationService translationService) {
        this.learningInteractionRepository = learningInteractionRepository;
        this.translationService = translationService;
    }
   

    public List<LearningInteractionResponse> getLearningInteractions() {
        return learningInteractionRepository.findAll().stream()
                .map(learningInteraction -> new LearningInteractionResponse(
                        learningInteraction.getSelectedText(),
                        Language.fromCode(learningInteraction.getTargetLanguage()).orElse(null)))
                .toList();
    }

    public TranslationResponse createLearningInteraction(LearningInteractionRequest request) {
        LearningInteraction learningInteraction = new LearningInteraction(
                request.selectedText(),
                request.nativeLanguage().getCode(),
                request.targetLanguage().getCode());

        LearningInteraction savedLearningInteraction = learningInteractionRepository.save(learningInteraction);
        Translation translation = translationService.translate(
                savedLearningInteraction.getSelectedText(),
                request.nativeLanguage(),
                request.targetLanguage());
    
        return new TranslationResponse(
                translation.getOriginalText(),
                translation.getTranslatedText(),
                translation.getNativeLanguage(),
                translation.getTargetLanguage(),
                translation.getCreatedAt(),
                translation.getId()
        );
    }
}

