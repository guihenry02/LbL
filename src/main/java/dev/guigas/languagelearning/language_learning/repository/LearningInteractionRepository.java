package dev.guigas.languagelearning.language_learning.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;

public interface LearningInteractionRepository extends JpaRepository<LearningInteraction, UUID>{


}