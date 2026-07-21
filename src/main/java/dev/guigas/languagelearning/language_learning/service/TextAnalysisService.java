package dev.guigas.languagelearning.language_learning.service;

import org.springframework.stereotype.Service;

import dev.guigas.languagelearning.language_learning.domain.LearningInteraction;
import dev.guigas.languagelearning.language_learning.domain.TextAnalysis;
import dev.guigas.languagelearning.language_learning.enums.AnalysisProvider;
import dev.guigas.languagelearning.language_learning.enums.InteractionType;


@Service
public class TextAnalysisService {


    public TextAnalysis analyze(LearningInteraction learningInteraction)
    {
        InteractionType interactionType = classify(learningInteraction);
        String translatedText = translate(learningInteraction);
        String explanation = explain();
        AnalysisProvider analysisProvider = getAnalysisProvider(); // Placeholder for the actual provider
        TextAnalysis textAnalysis = new TextAnalysis(interactionType, translatedText, explanation, analysisProvider, learningInteraction);
        return textAnalysis;
        // reestruturar pra fazer o service de LearningInteraction salvar a analise e não esse service aqui
    }

    private InteractionType classify(LearningInteraction learningInteraction) {
        // Implement classification logic here
        if (learningInteraction.getSelectedText() != null && learningInteraction.getSelectedText().matches(".*\\s.*")) {
            return InteractionType.SENTENCE;
        } else {
            return InteractionType.WORD;
        }
    }

    private String translate(LearningInteraction learningInteraction) {
        // Implement translation logic here
        return "Translated text"; // Placeholder
    }

    private String explain() {
        // Implement explanation logic here
        return "Explanation of the text"; // Placeholder
    }

    private AnalysisProvider getAnalysisProvider() {
        // Implement logic to determine the analysis provider
        return AnalysisProvider.AI; // Placeholder
    }

}
