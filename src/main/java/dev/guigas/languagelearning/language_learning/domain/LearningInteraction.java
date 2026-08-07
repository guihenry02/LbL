package dev.guigas.languagelearning.language_learning.domain;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_LEARNING_INTERACTIONS")
public class LearningInteraction {

    @Id 
    @GeneratedValue(strategy = GenerationType.UUID) 
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "native_language", nullable = false)
    private String nativeLanguage;

    @Column(name = "selected_text", nullable = false)
    private String selectedText;

    @Column(name = "target_language", nullable = false)
    private String targetLanguage;

    @CreationTimestamp 
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relacionamento com o Objeto, e não apenas o ID
    @ManyToOne
    @JoinColumn(name = "reading_session_id", referencedColumnName = "id")
    private ReadingSession readingSession;

    /**
     * Construtor vazio exigido pelo JPA/Hibernate.
     * Usamos protected para evitar que seja instanciado sem dados em outros lugares do código.
     */
    protected LearningInteraction() {}


    public LearningInteraction(String selectedText, String nativeLanguage, String targetLanguage, ReadingSession readingSession) {
        this.selectedText = selectedText;
        this.nativeLanguage = nativeLanguage;
        this.targetLanguage = targetLanguage;
        this.readingSession = readingSession;
    }


    public UUID getId() {
        return id;
    }

    public String getSelectedText() {
        return selectedText;
    }

    public String getNativeLanguage() {
        return nativeLanguage;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public ReadingSession getReadingSession() {
        return readingSession;
    }
}