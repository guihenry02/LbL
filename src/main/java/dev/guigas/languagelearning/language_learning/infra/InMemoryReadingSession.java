package dev.guigas.languagelearning.language_learning.infra;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Repository;

import dev.guigas.languagelearning.language_learning.domain.ReadingSession;
import dev.guigas.languagelearning.language_learning.repository.ReadingSessionRepository;

@Repository
public class InMemoryReadingSession implements ReadingSessionRepository {

    private final List<ReadingSession> sessions = new CopyOnWriteArrayList<>();
    @Override
    public void save(ReadingSession session) {
        sessions.add(session);
    }

    @Override
    public ReadingSession findById(UUID id) {
        return sessions.stream()
                .filter(session -> session.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<ReadingSession> findAll() {
        return new ArrayList<>(sessions);
    }

    @Override
    public void delete(ReadingSession session) {
        sessions.remove(session);
    }

    @Override
    public void updateFinishedAt(UUID id) {
        ReadingSession session = findById(id);
        if (session != null) {
            session.finish();   
        }
    }

}