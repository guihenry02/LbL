package dev.guigas.languagelearning.language_learning.analysis;

import java.util.ArrayList;
import java.util.List;

import dev.guigas.languagelearning.language_learning.domain.LearningEvidence;
import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;
import dev.guigas.languagelearning.language_learning.enums.InteractionType;

public class AnalysisContext {

    private final LearningInteraction learningInteraction;

    private InteractionType interactionType;

    private final List<LearningEvidence> evidences =
            new ArrayList<>();

    public AnalysisContext(LearningInteraction learningInteraction) {
        this.learningInteraction = learningInteraction;
    }

    public LearningInteraction getLearningInteraction() {
        return learningInteraction;
    }

    public InteractionType getInteractionType() {
        return interactionType;
    }

    public void setInteractionType(InteractionType interactionType) {
        this.interactionType = interactionType;
    }

    public void addEvidence(LearningEvidence evidence) {
        evidences.add(evidence);
    }

    public List<LearningEvidence> getEvidences() {
        return List.copyOf(evidences);
    }
}