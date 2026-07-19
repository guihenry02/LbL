package dev.guigas.languagelearning.language_learning.domain;
import java.time.LocalDateTime;
import java.util.UUID;

import dev.guigas.languagelearning.language_learning.enums.Language;

public class LearningInteraction{

    private final String selectedText;

    private final Language language;

    private final LocalDateTime createdAt;

    private final UUID id;



    public LearningInteraction(String selectedText, Language language) {

        if (selectedText == null || selectedText.trim().isEmpty()) {
            throw new IllegalArgumentException("Selected text cannot be null or empty");
        }
        
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