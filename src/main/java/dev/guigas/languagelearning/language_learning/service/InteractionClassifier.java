package dev.guigas.languagelearning.language_learning.service;

import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;
import dev.guigas.languagelearning.language_learning.enums.InteractionType;

@Service
public class InteractionClassifier {

    public InteractionType classify(LearningInteraction learningInteraction) {
        String selectedText = learningInteraction.getSelectedText();
        if (selectedText != null && selectedText.matches(".*\\s.*")) {
            return InteractionType.SENTENCE;
        }
        return InteractionType.WORD;
    }
}
