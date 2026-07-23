package dev.guigas.languagelearning.language_learning.service;

import java.util.List;

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
    private final ReadingSessionService readingSessionService;

    public LearningInteractionService(LearningInteractionRepository learningInteractionRepository, TranslationService translationService, ReadingSessionService readingSessionService) {
        this.learningInteractionRepository = learningInteractionRepository;
        this.translationService = translationService;
        this.readingSessionService = readingSessionService;
    }
   

    public List<LearningInteractionResponse> getLearningInteractions() {
        return learningInteractionRepository.findAll().stream()
                .map(learningInteraction -> new LearningInteractionResponse(
                        learningInteraction.getSelectedText(),
                        Language.fromCode(learningInteraction.getTargetLanguage()).orElse(null)))
                .toList();
    }

    public TranslationResponse createLearningInteraction(LearningInteractionRequest request) {

        if (request.readingSessionId() != null) {
                var readingSession = readingSessionService.getReadingSessionById(request.readingSessionId());
                if (readingSession == null) {
                    return TranslationResponse.error("Reading session not found for ID: " + request.readingSessionId());
                }
                
                if (readingSession.isFinished()) {
                    return TranslationResponse.error("Reading session is already finished for ID: " + request.readingSessionId());
                }

        } 

        LearningInteraction learningInteraction = new LearningInteraction(
                request.selectedText(),
                request.nativeLanguage().getCode(),
                request.targetLanguage().getCode(),
                request.readingSessionId());

        LearningInteraction savedLearningInteraction = learningInteractionRepository.save(learningInteraction);
        Translation translation = translationService.translate(
                savedLearningInteraction.getSelectedText(),
                request.nativeLanguage(),
                request.targetLanguage());
    
        return TranslationResponse.success(
                translation.getTranslatedText(),
                translation.getOriginalText(),
                translation.getNativeLanguage(),
                translation.getTargetLanguage(),
                translation.getCreatedAt(),
                translation.getId(),
                request.readingSessionId()
        );
    }
}

