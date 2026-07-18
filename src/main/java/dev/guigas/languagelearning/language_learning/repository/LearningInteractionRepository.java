package dev.guigas.languagelearning.language_learning.repository;

import java.util.List;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;

public interface LearningInteractionRepository {

    LearningInteraction save(LearningInteraction learningInteraction);

    List<LearningInteraction> findAll();

}