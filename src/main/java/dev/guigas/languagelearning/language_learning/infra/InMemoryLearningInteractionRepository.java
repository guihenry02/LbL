package dev.guigas.languagelearning.language_learning.infra;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Repository;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;
import dev.guigas.languagelearning.language_learning.repository.LearningInteractionRepository;

@Repository
public class InMemoryLearningInteractionRepository implements LearningInteractionRepository {

    private final List<LearningInteraction> interactions = new CopyOnWriteArrayList<>();

    @Override
    public LearningInteraction save(LearningInteraction learningInteraction) {
        interactions.add(learningInteraction);
        return learningInteraction;
    }

    @Override
    public List<LearningInteraction> findAll() {
        return List.copyOf(interactions);
    }
}
