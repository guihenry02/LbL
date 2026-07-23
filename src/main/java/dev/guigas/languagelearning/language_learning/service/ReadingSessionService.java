package dev.guigas.languagelearning.language_learning.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.ReadingSession;
import dev.guigas.languagelearning.language_learning.repository.ReadingSessionRepository;

@Service
public class ReadingSessionService {

    private final ReadingSessionRepository readingSessionRepository;
    
    public ReadingSessionService(ReadingSessionRepository readingSessionRepository) {
        this.readingSessionRepository = readingSessionRepository;
    }
    
    public ReadingSession createReadingSession() {
        ReadingSession session = new ReadingSession();
        readingSessionRepository.save(session);
        return session;

    }

    public ReadingSession finishReadingSession(UUID id) {
        readingSessionRepository.updateFinishedAt(id);
        return readingSessionRepository.findById(id);
    }

    public ReadingSession getReadingSessionById(UUID id) {
        return readingSessionRepository.findById(id);
    }
}