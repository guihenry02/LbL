package dev.guigas.languagelearning.language_learning.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.ReadingSession;
import dev.guigas.languagelearning.language_learning.dto.ReadingSessionResponse;
import dev.guigas.languagelearning.language_learning.repository.ReadingSessionRepository;

@Service
public class ReadingSessionService {

    private final ReadingSessionRepository readingSessionRepository;
    
    public ReadingSessionService(ReadingSessionRepository readingSessionRepository) {
        this.readingSessionRepository = readingSessionRepository;
    }
    
    public ReadingSessionResponse createReadingSession() {
        ReadingSession Session = new ReadingSession();
        readingSessionRepository.save(Session);
        return new ReadingSessionResponse(Session.getId(), Session.getCreatedAt());

    }

    public ReadingSessionResponse finishReadingSession(UUID id) {
        readingSessionRepository.updateFinishedAt(id);
        ReadingSession session = readingSessionRepository.findById(id);
        return session != null ? new ReadingSessionResponse(session.getId(), session.getCreatedAt(), session.getFinishedAt()) : null;
    }

    public ReadingSessionResponse getReadingSessionById(UUID id) {
        ReadingSession session = readingSessionRepository.findById(id);
        return session != null ? new ReadingSessionResponse(session.getId(), session.getCreatedAt(), session.getFinishedAt()) : null;
    }
}