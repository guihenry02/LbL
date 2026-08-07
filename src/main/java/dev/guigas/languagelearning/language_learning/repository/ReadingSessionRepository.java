package dev.guigas.languagelearning.language_learning.repository;

import java.util.List;
import java.util.UUID;

import dev.guigas.languagelearning.language_learning.domain.ReadingSession;

public interface ReadingSessionRepository extends org.springframework.data.jpa.repository.JpaRepository<ReadingSession, UUID> {
    List<ReadingSession> findByIsOpenTrue();
   
}
