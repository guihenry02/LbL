package dev.guigas.languagelearning.language_learning.domain;

import java.time.LocalDateTime;
import java.util.ArrayList; // Importante
import java.util.List;      // Importante
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id; // Importante
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_READING_SESSIONS")
public class ReadingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "finished_at", nullable = true)
    private LocalDateTime finishedAt;

    @Column(name = "is_open", nullable = false)
    private Boolean isOpen;
    
    // --- NOVA RELAÇÃO 1:N AQUI ---
    // mappedBy aponta para o nome do atributo exato na classe LearningInteraction
    @OneToMany(mappedBy = "readingSession", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LearningInteraction> interactions = new ArrayList<>(); // Inicializar a lista vazia é uma boa prática
    
    public ReadingSession() {
        this.finishedAt = null;
        this.isOpen = true;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public Boolean getIsOpen() {
        return isOpen;
    }

    public List<LearningInteraction> getInteractions() {
        return interactions;
    }

    // Métodos de negócio
    public void finish() {
        if (this.finishedAt != null) {
            throw new IllegalStateException("Reading session is already finished.");
        }
        this.finishedAt = LocalDateTime.now();
        this.isOpen = false;
    }

    public boolean isFinished() {
        return this.finishedAt != null;
    }
}