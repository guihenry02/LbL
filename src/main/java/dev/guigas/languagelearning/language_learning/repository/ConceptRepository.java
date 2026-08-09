package dev.guigas.languagelearning.language_learning.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import dev.guigas.languagelearning.language_learning.domain.Concept;

public interface ConceptRepository extends JpaRepository<Concept, UUID> {
    
}