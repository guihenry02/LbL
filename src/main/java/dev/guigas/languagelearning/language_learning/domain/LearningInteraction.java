package dev.guigas.languagelearning.language_learning.domain;
import java.time.LocalDateTime;
import java.util.UUID;

public class LearningInteraction{

    private final String selectedText;

    private final Language language;

    private final LocalDateTime createdAt;

    private final UUID id;

    public LearningInteraction(String selectedText, Language language) {
        this.selectedText = selectedText;
        this.language = language;
        this.createdAt = LocalDateTime.now();
        this.id = UUID.randomUUID();
    }

    public String getSelectedText() {
        return selectedText;
    }

    public Language getLanguage() {
        return language;
    }

    public UUID getId() {
        return id;
    }
}