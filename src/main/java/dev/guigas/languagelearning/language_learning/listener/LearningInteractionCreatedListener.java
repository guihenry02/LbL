package dev.guigas.languagelearning.language_learning.listener;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import dev.guigas.languagelearning.language_learning.analysis.AnalysisPipeline;
import dev.guigas.languagelearning.language_learning.event.LearningInteractionCreatedEvent;

@Component
public class LearningInteractionCreatedListener {

    private final AnalysisPipeline analysisPipeline;

    public LearningInteractionCreatedListener(AnalysisPipeline analysisPipeline) {
        this.analysisPipeline = analysisPipeline;
    }

    @EventListener
    public void handle(LearningInteractionCreatedEvent event) {

        analysisPipeline.analyze(event.getLearningInteractionId());

    }
}
