package dev.guigas.languagelearning.language_learning.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.guigas.languagelearning.language_learning.dto.LearningInteractionRequest;
import dev.guigas.languagelearning.language_learning.dto.LearningInteractionResponse;
import dev.guigas.languagelearning.language_learning.dto.TranslationResult;
import dev.guigas.languagelearning.language_learning.service.LearningInteractionService;
import dev.guigas.languagelearning.language_learning.service.TextAnalysisService;

@RequestMapping("/learning-interactions")
@RestController
public class LearningInteractionController {
    
    private final LearningInteractionService learningInteractionService;
    
    public LearningInteractionController(LearningInteractionService learningInteractionService, TextAnalysisService textAnalysisService) {
        this.learningInteractionService = learningInteractionService;
    }

    @GetMapping
    public List<LearningInteractionResponse> getLearningInteractions() {
        return learningInteractionService.getLearningInteractions();
    }

    @PostMapping
    public TranslationResult createLearningInteraction(@RequestBody LearningInteractionRequest request) {
        System.out.println("Received request: " + request);
        return learningInteractionService.createLearningInteraction(request);
    }


}
