package dev.guigas.languagelearning.language_learning.repository;

import java.util.List;
import java.util.UUID;

import dev.guigas.languagelearning.language_learning.domain.ReadingSession;

public interface ReadingSessionRepository {
    void save(ReadingSession session);
    ReadingSession findById(UUID id);
    List<ReadingSession> findAll();
    void delete(ReadingSession session);
    void updateFinishedAt(UUID id);
}
