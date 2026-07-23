package dev.guigas.languagelearning.language_learning.domain;
import java.time.LocalDateTime;
import java.util.UUID;

public class LearningInteraction{

    private final String nativeLanguage;

    private final String selectedText;

    private final String targetLanguage;

    private final LocalDateTime createdAt;

    private final UUID readingSessionId;

    private final UUID id;






    public LearningInteraction(String selectedText, String nativeLanguage, String targetLanguage, UUID readingSessionId) {

        if (selectedText == null || selectedText.trim().isEmpty()) {
            throw new IllegalArgumentException("Selected text cannot be null or empty");
        }
        if (nativeLanguage == null || nativeLanguage.trim().isEmpty()) {
            throw new IllegalArgumentException("Native language cannot be null or empty");
        }
        if (targetLanguage == null || targetLanguage.trim().isEmpty()) {
            throw new IllegalArgumentException("Target language cannot be null or empty");
        }


        this.nativeLanguage = nativeLanguage;
        this.selectedText = selectedText;
        this.targetLanguage = targetLanguage;
        this.createdAt = LocalDateTime.now();
        this.readingSessionId = readingSessionId;
        this.id = UUID.randomUUID();
    }

    public LearningInteraction(String selectedText, String nativeLanguage, String targetLanguage) {
        this(selectedText, nativeLanguage, targetLanguage, null);
    }

    public String getSelectedText() {
        return selectedText;
    }

    public String getNativeLanguage() {
        return nativeLanguage;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }

    public UUID getId() {
        return id;
    }
}