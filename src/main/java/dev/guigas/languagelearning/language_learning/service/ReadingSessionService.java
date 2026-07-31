package dev.guigas.languagelearning.language_learning.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.ReadingSession;
import dev.guigas.languagelearning.language_learning.repository.ReadingSessionRepository;

/* 
Ponto de atenção: uma única ReadingSession deve estar associado a um usuário. O mesmo não pode ter várias sessões de leitura ativas ao mesmo tempo. Portanto, é necessário implementar uma 
verificação para garantir que um usuário não possa iniciar uma nova sessão de leitura enquanto uma sessão anterior ainda estiver ativa.


*/

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