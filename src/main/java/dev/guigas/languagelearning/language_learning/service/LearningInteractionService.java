package dev.guigas.languagelearning.language_learning.service;

import java.util.List;

import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;
import dev.guigas.languagelearning.language_learning.domain.TextAnalysis;
import dev.guigas.languagelearning.language_learning.dto.LearningInteractionRequest;
import dev.guigas.languagelearning.language_learning.dto.LearningInteractionResponse;
import dev.guigas.languagelearning.language_learning.dto.TextAnalysisResponse;
import dev.guigas.languagelearning.language_learning.repository.LearningInteractionRepository;

@Service
public class LearningInteractionService {

    private final LearningInteractionRepository learningInteractionRepository;
    private final TextAnalysisService textAnalysisService;

    public LearningInteractionService(LearningInteractionRepository learningInteractionRepository, TextAnalysisService textAnalysisService) {
        this.learningInteractionRepository = learningInteractionRepository;
        this.textAnalysisService = textAnalysisService;
    }
    
   public List<LearningInteractionResponse> getLearningInteractions() {
        return learningInteractionRepository.findAll().stream()
                .map(learningInteraction -> new LearningInteractionResponse(
                        learningInteraction.getSelectedText(),
                        learningInteraction.getLanguage()))
                .toList();
    }

    public TextAnalysisResponse createLearningInteraction(LearningInteractionRequest request) {
        LearningInteraction learningInteraction = new LearningInteraction(request.selectedText(), request.language());
        LearningInteraction savedLearningInteraction = learningInteractionRepository.save(learningInteraction);
        TextAnalysis textAnalysis = textAnalysisService.analyze(savedLearningInteraction);
        return new TextAnalysisResponse(
                textAnalysis.getInteractionType(),
                textAnalysis.getTranslatedText(),
                textAnalysis.getExplanation());
    }

}

