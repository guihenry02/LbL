package dev.guigas.languagelearning.language_learning.service;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;
import dev.guigas.languagelearning.language_learning.domain.ReadingSession;
import dev.guigas.languagelearning.language_learning.dto.LearningInteractionRequest;
import dev.guigas.languagelearning.language_learning.dto.LearningInteractionResponse;
import dev.guigas.languagelearning.language_learning.dto.TranslationResult;
import dev.guigas.languagelearning.language_learning.enums.Language;
import dev.guigas.languagelearning.language_learning.event.LearningInteractionCreatedEvent;
import dev.guigas.languagelearning.language_learning.exceptions.BusinessRuleException;
import dev.guigas.languagelearning.language_learning.exceptions.ResourceNotFoundException;
import dev.guigas.languagelearning.language_learning.repository.LearningInteractionRepository;

/*
Ao criar uma LearningInteraction:

1. Verificar se a ReadingSession existe.
2. Verificar se pertence ao usuário autenticado.
3. Verificar se está OPEN.
4. Associar a interação à sessão.
*/
@Service
public class LearningInteractionService {

    private final LearningInteractionRepository learningInteractionRepository;
    private final TranslationService translationService;
    private final ReadingSessionService readingSessionService;
    ApplicationEventPublisher eventPublisher;

    public LearningInteractionService(
            LearningInteractionRepository learningInteractionRepository,
            TranslationService translationService,
            ReadingSessionService readingSessionService) {

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

    public TranslationResult createLearningInteraction(LearningInteractionRequest request) {

        ReadingSession readingSession = validateReadingSession(request);

        LearningInteraction learningInteraction = new LearningInteraction(
                request.selectedText(),
                request.nativeLanguage().getCode(),
                request.targetLanguage().getCode(),
                readingSession);

        LearningInteraction savedLearningInteraction = learningInteractionRepository.save(learningInteraction);
        eventPublisher.publishEvent(new LearningInteractionCreatedEvent(savedLearningInteraction.getId()));
        return translationService.translate(savedLearningInteraction);

    }

    private ReadingSession validateReadingSession(LearningInteractionRequest request) {

        if (request.readingSessionId() == null) {
            return null;
        }

        ReadingSession readingSession =
                readingSessionService.getReadingSessionById(request.readingSessionId());

        if (readingSession == null) {
            throw new ResourceNotFoundException(
                    "Reading session not found with ID: " + request.readingSessionId());
        }

        if (readingSession.isFinished()) {
            throw new BusinessRuleException(
                    "Reading session is already finished with ID: " + request.readingSessionId());
        }


        return readingSession;
    }
}