package dev.guigas.languagelearning.language_learning.domain;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_LEARNING_EVIDENCES")
public class LearningEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "learning_interaction_id", nullable = false)
    private UUID learningInteractionId;

    @Column(name = "concept_id", nullable = false)
    private UUID conceptId;

    @Column(nullable = false)
    private String occurrence;

    @Column(name = "canonical_occurrence")
    private String canonicalOccurrence;

    @Column(nullable = false)
    private double confidence;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected LearningEvidence() {
    }

    public LearningEvidence(
            UUID learningInteractionId,
            UUID conceptId,
            String occurrence,
            String canonicalOccurrence,
            double confidence) {

        if (learningInteractionId == null) {
            throw new IllegalArgumentException(
                "Learning interaction ID cannot be null"
            );
        }

        if (conceptId == null) {
            throw new IllegalArgumentException(
                "Concept ID cannot be null"
            );
        }

        if (occurrence == null || occurrence.isBlank()) {
            throw new IllegalArgumentException(
                "Occurrence cannot be null or blank"
            );
        }

        if (confidence < 0.0 || confidence > 1.0) {
            throw new IllegalArgumentException(
                "Confidence must be between 0 and 1"
            );
        }

        this.learningInteractionId = learningInteractionId;
        this.conceptId = conceptId;
        this.occurrence = occurrence;
        this.canonicalOccurrence = canonicalOccurrence;
        this.confidence = confidence;
    }

    public UUID getId() {
        return id;
    }

    public UUID getLearningInteractionId() {
        return learningInteractionId;
    }

    public UUID getConceptId() {
        return conceptId;
    }

    public String getOccurrence() {
        return occurrence;
    }

    public String getCanonicalOccurrence() {
        return canonicalOccurrence;
    }

    public double getConfidence() {
        return confidence;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}