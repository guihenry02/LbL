package dev.guigas.languagelearning.language_learning.controller;

import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.guigas.languagelearning.language_learning.domain.ReadingSession;
import dev.guigas.languagelearning.language_learning.dto.ReadingSessionResponse;
import dev.guigas.languagelearning.language_learning.service.ReadingSessionService;

@RequestMapping("/reading-session")
@RestController
public class ReadingSessionController {

    private final ReadingSessionService readingSessionService;

    public ReadingSessionController(ReadingSessionService readingSessionService) {
        this.readingSessionService = readingSessionService;
    }

    @PostMapping
    public ReadingSessionResponse startReadingSession() {
        ReadingSession session = readingSessionService.createReadingSession();
        return new ReadingSessionResponse(session.getId(), session.getCreatedAt());
    }

    @PostMapping("/{id}/finish")
    public ReadingSessionResponse finishReadingSession(@PathVariable UUID id) {
        ReadingSession session = readingSessionService.finishReadingSession(id);
        return session != null
                ? new ReadingSessionResponse(session.getId(), session.getCreatedAt(), session.getFinishedAt())
                : null;
    }

    @GetMapping("/{id}")
    public ReadingSessionResponse getReadingSessionById(@PathVariable UUID id) {
        ReadingSession session = readingSessionService.getReadingSessionById(id);
        return session != null
                ? new ReadingSessionResponse(session.getId(), session.getCreatedAt(), session.getFinishedAt())
                : null;
    }
}