package dev.guigas.languagelearning.language_learning.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReadingSessionResponse(UUID id, LocalDateTime createdAt, LocalDateTime finishedAt) {
    public ReadingSessionResponse(UUID id, LocalDateTime createdAt) {
        this(id, createdAt, null);
    }

}
