package dev.guigas.languagelearning.language_learning.event;

import java.util.UUID;

import org.springframework.context.ApplicationEvent;


public class LearningInteractionCreatedEvent extends ApplicationEvent {
    private final UUID learningInteractionId;
    
    public LearningInteractionCreatedEvent(UUID learningInteractionId) {
        super(learningInteractionId);
        this.learningInteractionId = learningInteractionId;
    }

    public UUID getLearningInteractionId() {
        return learningInteractionId;
    }
}