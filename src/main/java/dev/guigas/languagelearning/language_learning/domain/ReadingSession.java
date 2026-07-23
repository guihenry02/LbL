package dev.guigas.languagelearning.language_learning.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReadingSession {
    private final LocalDateTime createdAt;
    private final UUID id;
    private LocalDateTime finishedAt;
    private Boolean isOpen;
    

    public ReadingSession() {
        this.createdAt = LocalDateTime.now();
        this.id = UUID.randomUUID();
        this.finishedAt = null;
        this.isOpen = finishedAt == null;
        
    }

    public UUID getId() {
        return id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public void finish() {
        if (this.finishedAt != null) {
            throw new IllegalStateException("Reading session is already finished.");
        }
        this.finishedAt = LocalDateTime.now();
    }

    public boolean isFinished() {
        return this.finishedAt != null;
    }
}