package dev.guigas.languagelearning.language_learning.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import dev.guigas.languagelearning.language_learning.domain.LearningEvidence;

public interface LearningEvidenceRepository extends JpaRepository<LearningEvidence, UUID> {
    
}
