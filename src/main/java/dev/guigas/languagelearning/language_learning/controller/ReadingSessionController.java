package dev.guigas.languagelearning.language_learning.controller;

import java.util.UUID;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return readingSessionService.createReadingSession();
    }

    @PostMapping("/{id}/finish")
    public ReadingSessionResponse finishReadingSession(@PathVariable UUID id) {
        // @PathVariable avisa ao Spring para injetar o {id} da URL nesta variável
        return readingSessionService.finishReadingSession(id);
    }

    @PostMapping("/{id}")
    public ReadingSessionResponse getReadingSessionById(@PathVariable UUID id) {
        return readingSessionService.getReadingSessionById(id);
    }
}