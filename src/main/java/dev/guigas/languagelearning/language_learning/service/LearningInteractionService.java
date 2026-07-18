package dev.guigas.languagelearning.language_learning.service;

import java.util.List;

import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;
import dev.guigas.languagelearning.language_learning.dto.LearningInteractionRequest;
import dev.guigas.languagelearning.language_learning.dto.LearningInteractionResponse;
import dev.guigas.languagelearning.language_learning.repository.LearningInteractionRepository;

@Service
public class LearningInteractionService {

    private final LearningInteractionRepository learningInteractionRepository;

    public LearningInteractionService(LearningInteractionRepository learningInteractionRepository) {
        this.learningInteractionRepository = learningInteractionRepository;
    }
    
   public List<LearningInteractionResponse> getLearningInteractions() {
        return learningInteractionRepository.findAll().stream()
                .map(learningInteraction -> new LearningInteractionResponse(
                        learningInteraction.getSelectedText(),
                        learningInteraction.getLanguage()))
                .toList();
    }

    public LearningInteractionResponse createLearningInteraction(LearningInteractionRequest request) {
        LearningInteraction learningInteraction = new LearningInteraction(request.selectedText(), request.language());
        LearningInteraction savedLearningInteraction = learningInteractionRepository.save(learningInteraction);
        return new LearningInteractionResponse(
                savedLearningInteraction.getSelectedText(),
                savedLearningInteraction.getLanguage());
    }

}

