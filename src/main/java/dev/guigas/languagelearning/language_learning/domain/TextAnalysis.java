package dev.guigas.languagelearning.language_learning.domain;

import java.time.LocalDateTime;
import java.util.UUID;

import dev.guigas.languagelearning.language_learning.enums.AnalysisProvider;
import dev.guigas.languagelearning.language_learning.enums.InteractionType;

public class TextAnalysis {
    private final InteractionType interactionType;
    
    private final LocalDateTime createdAt;

    private final String translatedText;

    private final String explanation;

    private final AnalysisProvider analysisProvider;

    private final UUID id;

    public TextAnalysis(InteractionType interactionType, String translatedText, String explanation, AnalysisProvider analysisProvider) {
        this.interactionType = interactionType;
        this.createdAt = LocalDateTime.now();
        this.translatedText = translatedText;
        this.explanation = explanation;
        this.analysisProvider = analysisProvider;
        this.id = UUID.randomUUID();
    }

    public InteractionType getInteractionType() {
        return interactionType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getTranslatedText() {
        return translatedText;
    }

    public String getExplanation() {
        return explanation;
    }

    public AnalysisProvider getAnalysisProvider() {
        return analysisProvider;
    }

    public UUID getId() {
        return id;
    }
}
